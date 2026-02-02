module.exports = async ({ github, context, core }) => {
  const {
    JIRA_USER_EMAIL,
    JIRA_API_TOKEN,
    JIRA_BASE_URL,
    JIRA_PROJECT_KEY,
    TEAM_NAME,
    DRY_RUN,
  } = process.env

  const jiraAuth = Buffer.from(`${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')
  const dryRun = DRY_RUN === 'true'

  // Filtrer sur "hier" pour capturer toutes les alertes de la journée précédente
  // (le workflow tourne à 7h UTC, donc on traite les alertes de la veille complète)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0] // "2026-02-01"

  // Mapping sévérité → priorité Jira
  const priorityMap = {
    critical: 'Blocker',
    high: 'Major',
    medium: 'Minor',
    low: 'Trivial',
  }

  // 1. Récupérer les alertes Dependabot ouvertes
  const { data: allAlerts } = await github.rest.dependabot.listAlertsForRepo({
    owner: context.repo.owner,
    repo: context.repo.repo,
    state: 'open',
    per_page: 100,
  })

  // 2. Filtrer uniquement les alertes créées hier
  const yesterdayAlerts = allAlerts.filter((alert) => alert.created_at.startsWith(yesterdayStr))

  console.log(`📊 ${allAlerts.length} alertes ouvertes, ${yesterdayAlerts.length} créées hier (${yesterdayStr})`)

  if (yesterdayAlerts.length === 0) {
    console.log('✅ Aucune nouvelle alerte hier')
    return
  }

  let created = 0

  for (const alert of yesterdayAlerts) {
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

    const priority = priorityMap[alertData.severity] || 'Minor'
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

    // Création du ticket Jira
    const response = await fetch(`${JIRA_BASE_URL}/rest/api/2/issue`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${jiraAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          project: { key: JIRA_PROJECT_KEY },
          issuetype: { name: 'Bug' },
          summary: ticketSummary,
          description: description,
          priority: { name: priority },
          labels: ['dependabot', 'security', 'automated'],
          components: [{ name: TEAM_NAME }],
        },
      }),
    })

    if (response.ok) {
      const ticket = await response.json()
      console.log(`✅ Créé: ${ticket.key} - ${ticketSummary}`)
      created++
    } else {
      const error = await response.text()
      console.error(`❌ Erreur création: ${error}`)
    }
  }

  console.log(`\n📈 Résumé: ${created} ticket(s) créé(s)`)
}
