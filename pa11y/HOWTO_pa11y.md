### Step 1: Define Environment Variables
```
export FE_TEST_URL="http://localhost:3000"
export FE_PROD_URL="https://your-production-url.com"
```

### Step 2: Generate the Configuration
- For test:
  ```
  NODE_ENV=test node generatePa11yConfig.js
  ```
- For production:
  ```
  NODE_ENV=production node generatePa11yConfig.js
  ```

### Step 3: Run pa11y-ci
```
pa11y-ci --config pa11yConfig.json
```
