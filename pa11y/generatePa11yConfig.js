const fs = require('fs');

// Read environment variables
const testUrl = process.env.FE_TEST_URL || 'http://localhost:3000';
const prodUrl = process.env.FE_PROD_URL;

// Determine the environment
const isProduction = process.env.NODE_ENV === 'production';

// Set the base URL based on the environment
const baseUrl = isProduction ? prodUrl : testUrl;

// Pa11y configuration
const pa11yConfig = {
  defaults: {
    timeout: 5000,
    standard: 'WCAG2AA',
  },
  urls: [
    {
      url: `${baseUrl}/login`,
      actions: [
        'set field #email to admin@example.com',
        'set field #password to admin',
        'click element #submit',
        'wait for .container to be visible',
      ],
    },
  ],
};

// Write the configuration to a file
fs.writeFileSync('pa11yConfig.json', JSON.stringify(pa11yConfig, null, 2));

console.log('Pa11y configuration generated successfully.');
