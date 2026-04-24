/**
 * Validates the raw input strings
 * Returns valid edges and invalid entries
 */
function validateEdges(entries) {
  const valid = [];
  const invalid = [];
  
  for (let i = 0; i < entries.length; i++) {
    const item = entries[i];
    
    if (typeof item !== 'string') {
      invalid.push(item);
      continue;
    }
    
    // trim whitespace as it might be added by user input
    const trimmed = item.trim();
    
    // must have arrow
    if (!trimmed.includes('->')) {
      invalid.push(item); // pushing original item to show what failed
      continue;
    }
    
    const parts = trimmed.split('->');
    
    if (parts.length !== 2) {
      invalid.push(item);
      continue;
    }
    
    const parent = parts[0];
    const child = parts[1];
    
    // check if exact 1 character uppercase
    const regex = /^[A-Z]$/;
    if (!regex.test(parent) || !regex.test(child)) {
      invalid.push(item);
      continue;
    }
    
    // no self loops allowed
    if (parent === child) {
      invalid.push(item);
      continue;
    }
    
    // if we made it here, it's good
    valid.push(trimmed);
  }
  
  return { valid, invalid };
}

module.exports = {
  validateEdges
};
