module.exports = async ({ github, context, core }) => {
  const {
    JIRA_USER_EMAIL,
    JIRA_API_TOKEN,
    JIRA_BASE_URL,
    JIRA_PROJECT_KEY,
    TEAM_NAME,
    DRY_RUN,
    PROCESS_ALL,
    MAX_ALERTS,
  } = process.env

  const jiraAuth = Buffer.from(`${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')
  const dryRun = DRY_RUN === 'true'
  const processAll = PROCESS_ALL === 'true'
  const maxAlerts = parseInt(MAX_ALERTS || '0', 10)

  // Retry helper pour les appels Jira (max 2 retries, délais courts pour limiter le temps CI)
  const fetchWithRetry = async (url, options, maxRetries = 2) => {
    const delays = [1000, 2000] // 1s puis 2s
    let lastError

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, options)
        // Ne pas retry sur les erreurs client (4xx) - seulement sur les erreurs serveur (5xx)
        if (response.ok || (response.status >= 400 && response.status < 500)) {
          return response
        }
        lastError = new Error(`HTTP ${response.status}`)
      } catch (error) {
        lastError = error
      }

      if (attempt < maxRetries) {
        console.log(`⏳ Retry ${attempt + 1}/${maxRetries} dans ${delays[attempt] / 1000}s...`)
        await new Promise((resolve) => setTimeout(resolve, delays[attempt]))
      }
    }

    return { ok: false, text: async () => lastError.message }
  }

  // Filtrer sur "hier" pour capturer toutes les alertes de la journée précédente
  // (le workflow tourne à 7h UTC, donc on traite les alertes de la veille complète)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  // Mapping sévérité → priorité Jira
  const priorityMap = {
    critical: 'Bloquant',
    high: 'Majeur',
    medium: 'Mineur',
    low: 'Mineur',
  }

  // 1. Récupérer les alertes Dependabot ouvertes
  let allAlerts
  try {
    const response = await github.rest.dependabot.listAlertsForRepo({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: 'open',
      per_page: 100,
    })
    allAlerts = response.data
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération des alertes Dependabot: ${error.message}`)
    if (error.status === 403) {
      console.error('💡 Vérifiez que le workflow a les permissions "security-events: read"')
    } else if (error.status === 404) {
      console.error('💡 Vérifiez que Dependabot est activé sur ce repository')
    }
    core.setFailed(`Impossible de récupérer les alertes: ${error.message}`)
    return
  }

  // 2. Filtrer les alertes selon le mode
  let alertsToProcess
  if (processAll) {
    alertsToProcess = allAlerts
    console.log(`📊 ${allAlerts.length} alertes ouvertes (mode: TOUTES)`)
  } else {
    alertsToProcess = allAlerts.filter((alert) => alert.created_at.startsWith(yesterdayStr))
    console.log(`📊 ${allAlerts.length} alertes ouvertes, ${alertsToProcess.length} créées hier (${yesterdayStr})`)
  }

  // 3. Limiter le nombre si max_alerts > 0
  if (maxAlerts > 0 && alertsToProcess.length > maxAlerts) {
    console.log(`🔢 Limitation à ${maxAlerts} alertes (sur ${alertsToProcess.length})`)
    alertsToProcess = alertsToProcess.slice(0, maxAlerts)
  }

  if (alertsToProcess.length === 0) {
    console.log('✅ Aucune alerte à traiter')
    return
  }

  console.log(`\n🎯 ${alertsToProcess.length} alerte(s) à traiter${dryRun ? ' (DRY-RUN)' : ''}`)

  let created = 0

  for (const alert of alertsToProcess) {
    const alertData = {
      number: alert.number,
      package: alert.security_vulnerability?.package?.name || 'unknown',
      vulnerable_version: alert.security_vulnerability?.vulnerable_version_range,
      patched_version: alert.security_vulnerability?.first_patched_version?.identifier,
      severity: alert.security_advisory?.severity || 'medium',
      cvss_score: alert.security_advisory?.cvss?.score,
      cve_id: alert.security_advisory?.cve_id,
      summary: alert.security_advisory?.summary,
      url: alert.html_url,
      advisory_url: alert.security_advisory?.references?.[0]?.url,
      manifest_path: alert.dependency?.manifest_path,
    }

    const priority = priorityMap[alertData.severity] || 'Mineur'
    const ticketSummary = `[Security] Dependabot #${alertData.number}: ${alertData.package} (${alertData.severity})`

    // Description au format wiki Jira
    const description = `h2. Alerte de sécurité Dependabot

*Package:* ${alertData.package}
*Version vulnérable:* ${alertData.vulnerable_version || 'N/A'}
*Version corrigée:* ${alertData.patched_version || 'N/A'}
*Sévérité:* ${alertData.severity} (CVSS: ${alertData.cvss_score || 'N/A'})
*CVE:* ${alertData.cve_id || 'N/A'}
*Manifest:* ${alertData.manifest_path || 'N/A'}

h3. Vulnérabilité
${alertData.summary || 'Pas de description disponible'}

h3. Liens
* [Alerte GitHub|${alertData.url}]
${alertData.advisory_url ? `* [Advisory|${alertData.advisory_url}]` : ''}

----
_Ticket créé automatiquement - Équipe assignée: ${TEAM_NAME}_`

    if (dryRun) {
      console.log(`🧪 [DRY-RUN] Créerait: ${ticketSummary} → ${TEAM_NAME}`)
      created++
      continue
    }

    // Étape 1 : Créer le ticket avec le parent (sans équipe ni labels pour éviter l'écrasement par l'automation Jira)
    const response = await fetchWithRetry(`${JIRA_BASE_URL}/rest/api/2/issue`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${jiraAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          project: { key: JIRA_PROJECT_KEY },
          issuetype: { name: 'Tech Task' },
          summary: ticketSummary,
          description: description,
          priority: { name: priority },
          parent: { key: 'PC-39340' },
        },
      }),
    })

    if (response.ok) {
      const ticket = await response.json()
      console.log(`✅ Créé: ${ticket.key} - ${ticketSummary}`)
      created++

      // Étape 2 : Attendre que l'automation Jira termine, puis setter l'équipe et les labels
      console.log('⏳ Attente de 5s pour laisser l\'automation Jira terminer...')
      await new Promise((resolve) => setTimeout(resolve, 5000))

      const updateResponse = await fetchWithRetry(`${JIRA_BASE_URL}/rest/api/2/issue/${ticket.key}`, {
        method: 'PUT',
        headers: {
          Authorization: `Basic ${jiraAuth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            labels: ['dependabot', 'security', 'automated'],
            customfield_10049: { value: `JEUNES - ${TEAM_NAME}` },
          },
        }),
      })

      if (updateResponse.ok) {
        console.log(`✅ Équipe et labels mis à jour pour ${ticket.key}`)
      } else {
        const updateError = await updateResponse.text()
        console.error(`⚠️ Erreur mise à jour équipe/labels pour ${ticket.key}: ${updateError}`)
      }
    } else {
      const error = await response.text()
      console.error(`❌ Erreur création: ${error}`)
    }
  }

  console.log(`\n📈 Résumé: ${created} ticket(s) créé(s)`)
}
