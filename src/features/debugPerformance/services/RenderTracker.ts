import { RenderEvent } from '../types'
import { DataCollector } from '../utils/dataCollector'
import { safeExecute } from '../utils/errorHandler'
import { logger } from '../utils/logger'
import { now } from '../utils/performanceTiming'

type ProfilerOnRenderCallback = (
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number,
  interactions: Set<unknown>
) => void

interface ComponentRenderInfo {
  renderCount: number
  componentPath: string[]
  lastTriggerReason?: 'props' | 'state' | 'context' | 'hooks' | 'parent'
}

interface TreeNode {
  componentName: string
  depth: number
  children: Set<string>
  parent?: string
}

class RenderTracker {
  private static instance: RenderTracker | null = null
  private isTracking = false
  private componentRegistry = new Map<string, ComponentRenderInfo>()
  private componentTree = new Map<string, TreeNode>()
  private dataCollector = DataCollector.getInstance()

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance(): RenderTracker {
    if (!RenderTracker.instance) {
      RenderTracker.instance = new RenderTracker()
    }
    return RenderTracker.instance
  }

  startTracking(): boolean {
    return (
      safeExecute(
        () => {
          logger.debug('RenderTracker: Starting tracking...')
          this.isTracking = true
          this.componentRegistry.clear()
          this.componentTree.clear()
          logger.debug('RenderTracker: Tracking started, isTracking =', this.isTracking)
          return true
        },
        'RenderTracker.startTracking',
        false
      ) || false
    )
  }

  stopTracking(): boolean {
    return (
      safeExecute(
        () => {
          this.isTracking = false
          this.componentRegistry.clear()
          this.componentTree.clear()
          return true
        },
        'RenderTracker.stopTracking',
        false
      ) || false
    )
  }

  getOnRenderCallback(): ProfilerOnRenderCallback {
    return (id, phase, actualDuration, baseDuration, _startTime, _commitTime, _interactions) => {
      logger.verbose('React Profiler Callback:', {
        id,
        phase,
        actualDuration,
        isTracking: this.isTracking,
      })

      if (!this.isTracking) {
        logger.verbose('Tracking disabled, skipping render event for', id)
        return
      }

      safeExecute(() => {
        this.trackRender(id, phase, actualDuration, baseDuration)
      }, 'RenderTracker.onRenderCallback')
    }
  }

  private trackRender(
    componentName: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number
  ): void {
    logger.verbose('Tracking render for:', componentName, 'phase:', phase)
    const currentInfo = this.componentRegistry.get(componentName)
    const renderCount = currentInfo ? currentInfo.renderCount + 1 : 1
    const triggerReason = this.detectTriggerReason(componentName, phase, currentInfo)

    this.updateComponentRegistry(componentName, renderCount, triggerReason)
    this.updateComponentTree(componentName, phase)

    const renderEvent: RenderEvent = {
      eventId: this.generateEventId(),
      sessionId: this.getCurrentSessionId(),
      componentName,
      renderCount,
      timestamp: now(),
      phase,
      actualDuration,
      baseDuration,
      triggerReason,
      childrenCount: this.getChildrenCount(componentName),
      memoryUsage: this.estimateMemoryUsage(),
    }

    this.dataCollector.collectRenderData(renderEvent)
  }

  private updateComponentRegistry(
    componentName: string,
    renderCount: number,
    triggerReason?: 'props' | 'state' | 'context' | 'hooks' | 'parent'
  ): void {
    const componentPath = this.buildComponentPath(componentName)

    this.componentRegistry.set(componentName, {
      renderCount,
      componentPath,
      lastTriggerReason: triggerReason,
    })
  }

  private updateComponentTree(componentName: string, phase: 'mount' | 'update'): void {
    if (phase === 'mount') {
      const depth = this.calculateDepth(componentName)
      const parent = this.findParentComponent(componentName)

      this.componentTree.set(componentName, {
        componentName,
        depth,
        children: new Set(),
        parent,
      })

      if (parent && this.componentTree.has(parent)) {
        const parentNode = this.componentTree.get(parent)
        if (!parentNode) return

        parentNode.children.add(componentName)
      }
    }
  }

  private detectTriggerReason(
    componentName: string,
    phase: 'mount' | 'update',
    currentInfo?: ComponentRenderInfo
  ): 'props' | 'state' | 'context' | 'hooks' | 'parent' | undefined {
    if (phase === 'mount') {
      return 'props'
    }

    if (!currentInfo) {
      return 'props'
    }

    const stackTrace = new Error().stack
    if (!stackTrace) return 'props'

    const stackLines = stackTrace.split('\n')

    for (const line of stackLines) {
      if (line && (line.includes('useState') || line.includes('useReducer'))) {
        return 'state'
      }
      if (line && (line.includes('useContext') || line.includes('Context'))) {
        return 'context'
      }
      if (
        line &&
        (line.includes('useEffect') || line.includes('useCallback') || line.includes('useMemo'))
      ) {
        return 'hooks'
      }
    }

    const hasParentRender = this.hasRecentParentRender(componentName)
    if (hasParentRender) {
      return 'parent'
    }

    return 'props'
  }

  private hasRecentParentRender(componentName: string): boolean {
    const node = this.componentTree.get(componentName)
    if (!node?.parent) return false

    const parentInfo = this.componentRegistry.get(node.parent)
    if (!parentInfo) return false

    const timeDifference = now() - parentInfo.renderCount * 100
    return timeDifference < 50
  }

  private buildComponentPath(componentName: string): string[] {
    const path: string[] = []
    let currentComponent: string | undefined = componentName

    while (currentComponent && this.componentTree.has(currentComponent)) {
      path.unshift(currentComponent)
      currentComponent = this.componentTree.get(currentComponent)?.parent
    }

    if (path.length === 0) {
      path.push(componentName)
    }

    return path
  }

  private calculateDepth(componentName: string): number {
    let depth = 0
    let current: string | undefined = this.findParentComponent(componentName)

    while (current && this.componentTree.has(current)) {
      depth++
      current = this.componentTree.get(current)?.parent
    }

    return depth
  }

  private findParentComponent(componentName: string): string | undefined {
    const stackTrace = new Error().stack
    if (!stackTrace) return undefined

    const lines = stackTrace.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line && line.includes('React') && !line.includes(componentName)) {
        const match = line.match(/at (\w+)/)
        if (match && match[1] !== componentName) {
          return match[1]
        }
      }
    }

    return undefined
  }

  private getChildrenCount(componentName: string): number {
    const treeNode = this.componentTree.get(componentName)
    return treeNode ? treeNode.children.size : 0
  }

  private estimateMemoryUsage(): number {
    return Math.floor(Math.random() * 1024 * 10)
  }

  private generateEventId(): string {
    return `render_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getCurrentSessionId(): string {
    return this.dataCollector.getQueueStats()?.processed ? 'active_session' : 'session_default'
  }

  getComponentStats(): Array<{
    componentName: string
    renderCount: number
    avgRenderTime: number
    lastTrigger?: string
  }> {
    return (
      safeExecute(
        () => {
          const stats: Array<{
            componentName: string
            renderCount: number
            avgRenderTime: number
            lastTrigger?: string
          }> = []

          this.componentRegistry.forEach((info, componentName) => {
            stats.push({
              componentName,
              renderCount: info.renderCount,
              avgRenderTime: 0,
              lastTrigger: info.lastTriggerReason,
            })
          })

          return stats.sort((a, b) => b.renderCount - a.renderCount)
        },
        'RenderTracker.getComponentStats',
        []
      ) || []
    )
  }

  getComponentTree(): Map<string, TreeNode> {
    return new Map(this.componentTree)
  }

  filterComponents(options: {
    namePattern?: RegExp
    minRenderCount?: number
    triggerType?: 'props' | 'state' | 'context' | 'hooks' | 'parent'
  }): string[] {
    return (
      safeExecute(
        () => {
          const filtered: string[] = []

          this.componentRegistry.forEach((info, componentName) => {
            let shouldInclude = true

            if (options.namePattern && !options.namePattern.test(componentName)) {
              shouldInclude = false
            }

            if (options.minRenderCount && info.renderCount < options.minRenderCount) {
              shouldInclude = false
            }

            if (options.triggerType && info.lastTriggerReason !== options.triggerType) {
              shouldInclude = false
            }

            if (shouldInclude) {
              filtered.push(componentName)
            }
          })

          return filtered
        },
        'RenderTracker.filterComponents',
        []
      ) || []
    )
  }

  clearTracking(): void {
    safeExecute(() => {
      this.componentRegistry.clear()
      this.componentTree.clear()
    }, 'RenderTracker.clearTracking')
  }

  isCurrentlyTracking(): boolean {
    return this.isTracking
  }
}

export { RenderTracker }
export type { ProfilerOnRenderCallback, TreeNode }
