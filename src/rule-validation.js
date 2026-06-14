const validMatchModes = new Set(['exact', 'includes', 'regex']);

export function validateRulesConfig(config) {
  const errors = [];
  const warnings = [];

  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    return {
      ok: false,
      ruleCount: 0,
      errors: ['Rules file must contain a JSON object.'],
      warnings
    };
  }

  if (config.defaultReply !== undefined) {
    validateReply(config.defaultReply, 'defaultReply', errors);
  }

  if (!Array.isArray(config.rules)) {
    errors.push('rules must be an array.');
  }

  const rules = Array.isArray(config.rules) ? config.rules : [];

  rules.forEach((rule, index) => {
    const path = `rules[${index}]`;

    if (!rule || typeof rule !== 'object' || Array.isArray(rule)) {
      errors.push(`${path} must be an object.`);
      return;
    }

    if (!rule.name || typeof rule.name !== 'string') {
      errors.push(`${path}.name must be a non-empty string.`);
    }

    const matchMode = rule.match || 'includes';

    if (!validMatchModes.has(matchMode)) {
      errors.push(`${path}.match must be one of exact, includes, regex.`);
    }

    if (!Array.isArray(rule.keywords) || rule.keywords.length === 0) {
      errors.push(`${path}.keywords must be a non-empty array.`);
    } else {
      rule.keywords.forEach((keyword, keywordIndex) => {
        if (!keyword || typeof keyword !== 'string') {
          errors.push(`${path}.keywords[${keywordIndex}] must be a non-empty string.`);
        }

        if (matchMode === 'regex') {
          try {
            new RegExp(keyword);
          } catch (error) {
            errors.push(`${path}.keywords[${keywordIndex}] is not a valid regex: ${error.message}`);
          }
        }
      });
    }

    validateReply(rule.reply, `${path}.reply`, errors);

    if (rule.reply && Array.isArray(rule.reply) && rule.reply.length > 3) {
      warnings.push(`${path}.reply has ${rule.reply.length} messages. LINE allows up to 5, but shorter replies usually perform better.`);
    }
  });

  return {
    ok: errors.length === 0,
    ruleCount: rules.length,
    errors,
    warnings
  };
}

function validateReply(reply, path, errors) {
  if (reply === undefined || reply === null || reply === '') {
    errors.push(`${path} must not be empty.`);
    return;
  }

  const messages = Array.isArray(reply) ? reply : [reply];

  if (messages.length > 5) {
    errors.push(`${path} has ${messages.length} messages. LINE reply API allows at most 5 messages.`);
  }

  messages.forEach((message, index) => {
    const itemPath = Array.isArray(reply) ? `${path}[${index}]` : path;

    if (typeof message === 'string') {
      if (message.trim().length === 0) {
        errors.push(`${itemPath} must not be blank.`);
      }

      if (message.length > 5000) {
        errors.push(`${itemPath} is longer than LINE text message limit of 5000 characters.`);
      }

      return;
    }

    if (!message || typeof message !== 'object' || Array.isArray(message)) {
      errors.push(`${itemPath} must be a string or LINE message object.`);
      return;
    }

    if (!message.type || typeof message.type !== 'string') {
      errors.push(`${itemPath}.type must be a string.`);
    }

    if (message.type === 'text') {
      if (!message.text || typeof message.text !== 'string') {
        errors.push(`${itemPath}.text must be a non-empty string.`);
      } else if (message.text.length > 5000) {
        errors.push(`${itemPath}.text is longer than LINE text message limit of 5000 characters.`);
      }
    }
  });
}
