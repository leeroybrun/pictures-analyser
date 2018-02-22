function nsResolver(prefix) {
  var ns = {
    'x' : 'adobe:ns:meta/',
    'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
  };
  return ns[prefix] || null;
}

function getRdfElement(xmlDoc) {
	return xmlDoc.evaluate('/x:xmpmeta/rdf:RDF/rdf:Description', xmlDoc, nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function getAttributesValues(node) {
  return Array.from(node.attributes).filter(function(attr) {
		return ['rdf', 'xmlns', 'xmp'].indexOf(attr.prefix) === -1;
  }).reduce(function(acc, attr, i) {
    acc[attr.localName] = attr.value;
    return acc;
  }, {});
}

function filterChildNodes(node) {
	return Array.from(node.childNodes).filter(function(node) {
  	return node.nodeType === 1;
  });
}

function parseNode(node) {
	if(node.nodeName === 'rdf:Bag' || node.nodeName === 'rdf:Seq') {
  	return filterChildNodes(node).map(function(childNode) {
    	return parseNode(childNode);
    });
  }
  
	const nodeAttrsObj = getAttributesValues(node);
  const childNodes = filterChildNodes(node);
  
  if(Object.keys(nodeAttrsObj).length === 0 && childNodes.length === 0) {
  	return node.textContent;
  }
  
  const childNodesObj = childNodes.reduce(function(acc, childNode, i) {
    acc[childNode.localName] = parseNode(childNode);
    return acc;
  }, {});
  
  const childNodesKeys = Object.keys(childNodesObj);
  
  if(childNodesKeys.length === 1 && Object.keys(nodeAttrsObj).length === 0) {
  	const childNodeName = childNodesKeys[0];
  	if(['Seq', 'Bag', 'Description'].indexOf(childNodeName) !== -1) {
    	return childNodesObj[childNodeName];
    }
  }
  
  return Object.assign({}, nodeAttrsObj, childNodesObj);
}

function parseXmp(xmpString) {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(xmpString, "application/xml");

  const rdfElement = getRdfElement(xmlDoc);

  return parseNode(rdfElement);
}

export default parseXmp;

