import { CategoryResponseModel } from 'api/gen'

type CategoryNode = {
  id: string
  gtls?: Array<string>
  label: string
  position?: number
  searchFilter?: string
  children: Record<string, CategoryNode>
}
export type CategoryTree = Record<string, CategoryNode>

function initNodeFromResponseModel(category: CategoryResponseModel) {
  return {
    id: category.id,
    gtls: category.gtls,
    label: category.label,
    position: category.position,
    searchFilter: category.searchFilter,
    children: {},
  } as CategoryNode
}

function createNode(
  categories: CategoryResponseModel[],
  tree: CategoryTree,
  nodes: Record<string, CategoryNode>,
  currentCategory: CategoryResponseModel
) {
  if (!nodes[currentCategory.id]) {
    nodes[currentCategory.id] = initNodeFromResponseModel(currentCategory)
  }
  const currentNode = nodes[currentCategory.id]
  if (!currentNode) return

  if (currentCategory.parents.length > 0) {
    currentCategory.parents.forEach((parentId) => {
      if (!nodes[parentId]) {
        const parentCategory = categories.find((category) => category.id === parentId)
        if (parentCategory) {
          createNode(categories, tree, nodes, parentCategory)
        }
      }
      const parentNode = nodes[parentId]
      if (parentNode) {
        parentNode.children[currentNode.id] = currentNode
      }
    })
  } else if (tree[currentCategory.id] === undefined) {
    tree[currentNode.id] = currentNode
  }
}

export function createCategoryTree(categories: CategoryResponseModel[]) {
  const tree: CategoryTree = {}
  const nodes: Record<string, CategoryNode> = {}
  categories.forEach((category) => {
    createNode(categories, tree, nodes, category)
  })

  return tree
}
