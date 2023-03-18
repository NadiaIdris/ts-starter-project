type DOMNode = {
  data: DOMNode;
  children: DOMNode[];
  parent: DOMNode | null;
  attributes: { [key: string]: string };
  findNodeWithAttributeValuePattern: (
    nodeName: string,
    attributeName: string,
    attributePattern: string
  ) => DOMNode | null;
};

type SearchPatterns = {
  startsWith: (str: string) => boolean;
  endsWith: (str: string) => boolean;
  containsInTheMiddle: (str: string) => boolean;
};

type SearchPatternRule = "startsWith" | "endsWith" | "containsInTheMiddle";

enum NodeName {
  section = "section",
  main = "main",
  article = "article",
  p = "p",
}

const nodesToSearchInOrder: NodeName[] = [
  NodeName.section,
  NodeName.main,
  NodeName.article,
  NodeName.p,
];

// ---------------- Data -------------------------
const { section, main, article, p } = NodeName;

const data = [
  {
    nodeName: section,
    attributeName: "id",
    attributePattern: "11*",
  },
  {
    nodeName: main,
    attributeName: "id",
    attributePattern: "*22",
  },
  {
    nodeName: article,
    attributeName: "id",
    attributePattern: "*33*",
  },
  {
    nodeName: p,
    attributeName: "class",
    attributeValue: "flag",
  },
];

// const getAttributeSearchPattern = (num: string, rule: SearchPatternRule) => {
//   if (rule === "startsWith") return `${num}*`;
//   if (rule === "endsWith") return `*${num}`;
//   if (rule === "containsInTheMiddle") return `*${num}*`;
// };

// const getNodeSearchPattern = (
//   nodeName: NodeName,
//   patterns: SearchPatterns
// ): string | undefined => {
//   if (nodeName === section)
//     return getAttributeSearchPattern("11", "startsWith");
//   if (nodeName === main) return getAttributeSearchPattern("22", "endsWith");
//   if (nodeName === article)
//     return getAttributeSearchPattern("33", "containsInTheMiddle");
// };

function parsePattern(pattern: string) {
  const patternArray = pattern.split("");

  const startsWithStr = patternArray[patternArray.length - 1] === "*";
  const endsWithStr = patternArray[0] === "*";

  return "";
}

function isValidPattern(
  nodeName: string,
  attribute: string,
  pattern: string | undefined
) {
  // attribute value starts with 11, ends with 22, contains 33 in the middle?
  if (nodeName === section && attribute === "id" && pattern?.startsWith("11"))
    return true;
  if (nodeName === main && attribute === "id" && pattern?.endsWith("22"))
    return true;
  if (nodeName === article && attribute === "id") {
    // Remove the first and the last character from the pattern, so that we can search the middle part of the string.
    const patternArray = pattern?.split("").slice(1, pattern.length - 1);
    return patternArray?.includes("33");
  }
}

function getURLFromDOMTree(startNode: Node): string {
  const urlArray: string[] = [];
  const stack: any = [];
  // Seed the stack with the startNode or its children.
  if (startNode.nodeName === "BODY") {
    addChildrenToStack(startNode)
  } else { 
    stack.push(startNode);
  }
  let currentNode;
  let dataIndex = 0;
  let currentSearchRules = data[dataIndex];

  while (stack.length > 0) {
    // Destructure for readability.
    const { nodeName, attributeName, attributePattern, attributeValue } = currentSearchRules;
    currentNode = stack.pop();
    const currentNodeNameMatches = currentNode.nodeName.toLowercase() === nodeName;

    // Check if the current node has the attribute with the given name and value pattern.
    if (
      currentNodeNameMatches &&
      currentNode.hasAttribute(attributeName) &&
      isValidPattern(nodeName, attributeName, attributePattern)
    ) {
      dataIndex++;
      currentSearchRules = data[ dataIndex ];
    }

    const hasFlagClass = currentNode.getAttribute(attributeName) === attributeValue;
    if ( currentNodeNameMatches && hasFlagClass && currentNode.hasAttribute("value")) { 
      urlArray.push(currentNode.getAttribute("value"));
      // Found the "p" node with the "flag" class and the "value" attribute. We can stop the search.
      continue;
    }

    // If leaf node, 
    if (currentNode.childNodes.length === 0)

    addChildrenToStack(currentNode)

  }

  function addChildrenToStack(currentNode: Node) {
    const children = [ ...currentNode.childNodes ];
    children.forEach(child => stack.push(child))
  }


  return urlArray.reverse().join("");
}

const hiddenURL = getURLFromDOMTree(document.body);

// NOTES: Use DFS and reverse the string before joining.

// FUNCTION SIGNATURE:
// findNodeWithAttribute("section", "id", "11*"); <-- if this is true, then, increment the info[i] index and search for the next data set.
// findNodeWithAttribute("main", "id", "*22");
// findNodeWithAttribute("article", "id", "*33*"); <-- if true, then
// findNodeWithAttribute("p", "class"); //If third argument is not provided, dont' look for the attrubute pattern match. Just look for

// Write a code that there can be multiple section siblings witch start with 11, multiple main
// siblings witch end with 22 and multiple article siblings witch contain 33 in the middle.

// function hasAttruto take pattern (11*, *22, *33*) and idAttrubute

// STEPS:
// Check does the node
//   (matchesNodeName(nodeName) && hasAttribute(attributeName) && matchesAttributeValue(attributeName, pattern))
//   (matches the node name && does the node has the attribute with the given name && does the attribute value matches the given pattern)
//
// Loop over all the children of the given node and find all the nodes with the given name, attribute and attribute value pattern.
// Put all the found nodes in the array.
// find node with attribute which value matches the given pattern. Put this node in the array.
