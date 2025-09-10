import { TreeNode } from '../services/RenderTracker'

export interface TreeTraversalOptions {
  maxDepth?: number
  includeChildren?: boolean
  filterByName?: RegExp
}

export interface ComponentTreeStats {
  totalComponents: number
  maxDepth: number
  averageChildren: number
  rootComponents: string[]
  leafComponents: string[]
}

export class ComponentTreeUtils {
  static traverseTree(
    tree: Map<string, TreeNode>,
    startNode?: string,
    options: TreeTraversalOptions = {}
  ): string[] {
    const visited = new Set<string>()
    const result: string[] = []
    const { maxDepth = Infinity, filterByName } = options

    const traverse = (componentName: string, currentDepth = 0) => {
      if (visited.has(componentName) || currentDepth > maxDepth) {
        return
      }

      const node = tree.get(componentName)
      if (!node) return

      visited.add(componentName)

      if (filterByName && !filterByName.test(componentName)) {
        // Still need to traverse children even if parent doesn't match
        if (options.includeChildren !== false && node.children.size > 0) {
          node.children.forEach((childName) => {
            traverse(childName, currentDepth + 1)
          })
        }
        return
      }

      result.push(componentName)

      if (options.includeChildren !== false && node.children.size > 0) {
        node.children.forEach((childName) => {
          traverse(childName, currentDepth + 1)
        })
      }
    }

    if (startNode) {
      traverse(startNode)
    } else {
      const rootNodes = this.findRootNodes(tree)
      rootNodes.forEach((rootNode) => traverse(rootNode))
    }

    return result
  }

  static findRootNodes(tree: Map<string, TreeNode>): string[] {
    const roots: string[] = []

    tree.forEach((node, componentName) => {
      if (!node.parent || !tree.has(node.parent)) {
        roots.push(componentName)
      }
    })

    return roots
  }

  static findLeafNodes(tree: Map<string, TreeNode>): string[] {
    const leaves: string[] = []

    tree.forEach((node, componentName) => {
      if (node.children.size === 0) {
        leaves.push(componentName)
      }
    })

    return leaves
  }

  static getTreeStats(tree: Map<string, TreeNode>): ComponentTreeStats {
    const rootComponents = this.findRootNodes(tree)
    const leafComponents = this.findLeafNodes(tree)

    let totalChildren = 0
    let maxDepth = 0

    tree.forEach((node) => {
      totalChildren += node.children.size
      maxDepth = Math.max(maxDepth, node.depth)
    })

    const averageChildren = tree.size > 0 ? totalChildren / tree.size : 0

    return {
      totalComponents: tree.size,
      maxDepth,
      averageChildren: Math.round(averageChildren * 100) / 100,
      rootComponents,
      leafComponents,
    }
  }

  static findComponentPath(tree: Map<string, TreeNode>, targetComponent: string): string[] | null {
    const node = tree.get(targetComponent)
    if (!node) return null

    const path: string[] = []
    let current: TreeNode | undefined = node

    while (current) {
      path.unshift(current.componentName)
      current = current.parent ? (tree.get(current.parent) ?? undefined) : undefined
    }

    return path
  }

  static findCommonAncestor(
    tree: Map<string, TreeNode>,
    component1: string,
    component2: string
  ): string | null {
    const path1 = this.findComponentPath(tree, component1)
    const path2 = this.findComponentPath(tree, component2)

    if (!path1 || !path2) return null

    let commonAncestor: string | null = null
    const minLength = Math.min(path1.length, path2.length)

    for (let i = 0; i < minLength; i++) {
      if (path1[i] === path2[i]) {
        commonAncestor = path1[i] || null
      } else {
        break
      }
    }

    return commonAncestor
  }

  static getSubtree(tree: Map<string, TreeNode>, rootComponent: string): Map<string, TreeNode> {
    const subtree = new Map<string, TreeNode>()
    const descendants = this.traverseTree(tree, rootComponent, { includeChildren: true })

    descendants.forEach((componentName) => {
      const node = tree.get(componentName)
      if (node) {
        subtree.set(componentName, { ...node })
      }
    })

    return subtree
  }

  static filterTreeByRenderCount(
    tree: Map<string, TreeNode>,
    renderCounts: Map<string, number>,
    minRenderCount: number
  ): Map<string, TreeNode> {
    const filtered = new Map<string, TreeNode>()

    tree.forEach((node, componentName) => {
      const renderCount = renderCounts.get(componentName) || 0
      if (renderCount >= minRenderCount) {
        filtered.set(componentName, { ...node })
      }
    })

    return filtered
  }

  static printTree(tree: Map<string, TreeNode>, renderCounts?: Map<string, number>): string {
    const rootNodes = this.findRootNodes(tree)
    const lines: string[] = []

    const printNode = (componentName: string, indent = '') => {
      const node = tree.get(componentName)
      if (!node) return

      const renderCount = renderCounts?.get(componentName) || 0
      const countStr = renderCount > 0 ? ` (${renderCount} renders)` : ''
      lines.push(`${indent}${componentName}${countStr}`)

      const childArray = Array.from(node.children).sort()
      childArray.forEach((child, index) => {
        const isLast = index === childArray.length - 1
        const newIndent = indent + (isLast ? '  ' : '│ ')
        const prefix = isLast ? '└─' : '├─'

        lines.push(`${indent}${prefix} `)
        printNode(child, newIndent)
      })
    }

    rootNodes.forEach((rootNode) => {
      printNode(rootNode)
      lines.push('')
    })

    return lines.join('\n')
  }
}
