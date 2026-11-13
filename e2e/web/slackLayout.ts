import type { SummaryResults } from 'playwright-slack-report/dist/src'

const escapeMrkdwn = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const metaValue = (summary: SummaryResults, key: string) =>
  summary.meta?.find((item) => item.key === key)?.value

const outcome = (summary: SummaryResults) => {
  if (summary.failed > 0) return '🔴 E2E web en échec'
  if (summary.flaky) return '🟡 E2E web passés avec des tests flaky'
  if (summary.passed === 0) return '⚪ Aucun test E2E web passé'
  return '✅ E2E web passés'
}

// Adapted from generateBuildSummary in the playwright-slack-report layout gallery.
export const generateBuildSummary = (summary: SummaryResults) => {
  const runUrl = metaValue(summary, 'Run')
  const context = [
    `🌿 ${escapeMrkdwn(metaValue(summary, 'Branche') ?? 'inconnue')}`,
    `📁 ${escapeMrkdwn(metaValue(summary, 'Suite') ?? 'inconnue')}`,
    ...(runUrl ? [`<${runUrl}|Voir le run>`] : []),
  ].join('  ·  ')

  return [
    { type: 'header', text: { type: 'plain_text', text: outcome(summary), emoji: true } },
    {
      type: 'section',
      fields: [
        `*✅ Réussis*\n${summary.passed}`,
        `*🔴 Échoués*\n${summary.failed}`,
        `*🟡 Flaky*\n${summary.flaky ?? 0}`,
        `*⏭ Ignorés*\n${summary.skipped}`,
      ].map((text) => ({ type: 'mrkdwn', text })),
    },
    { type: 'divider' },
    { type: 'context', elements: [{ type: 'mrkdwn', text: context }] },
  ]
}
