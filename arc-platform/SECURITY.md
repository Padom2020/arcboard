# Security Guidelines

## Environment Variables and Secrets

### Protected Files

The following files contain sensitive information and are protected by `.gitignore`:

- `.env` - Never commit this file
- `.env.local` - Local development environment variables
- `.env*.local` - All local environment files
- `.env.development` - Development-specific variables
- `.env.production` - Production-specific variables
- `.env.staging` - Staging-specific variables
- `*.key` - Private keys
- `*.secret` - Secret files
- `secrets.json` - JSON files containing secrets

### Setting Up Environment Variables

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your actual values:**
   - Never use example values in production
   - Use strong, unique values for each environment
   - Keep development and production secrets separate

3. **Verify .gitignore:**
   ```bash
   git status --ignored
   ```
   Ensure your `.env.local` file appears in the ignored files list.

### Required Environment Variables

#### Database
- `DATABASE_URL` - PostgreSQL or SQLite connection string

#### OpenAI API
- `OPENAI_API_KEY` - Required for AI Assistant and Debugging features
- Get your key from: https://platform.openai.com/api-keys

#### Application
- `NEXT_PUBLIC_APP_URL` - Your application's public URL
- `NODE_ENV` - Environment (development, production, test)

### Optional Environment Variables

- `OPENZEPPELIN_API_KEY` - For Smart Contract Generator
- `OPENAI_MODEL` - Specify OpenAI model (default: gpt-3.5-turbo)
- `OPENAI_ORG_ID` - OpenAI organization ID

## API Key Security

### Best Practices

1. **Never expose API keys in client-side code**
   - Only use `NEXT_PUBLIC_*` prefix for non-sensitive values
   - Keep API keys in server-side code only

2. **Rotate keys regularly**
   - Change API keys every 90 days
   - Immediately rotate if compromised

3. **Use environment-specific keys**
   - Different keys for development, staging, and production
   - Never use production keys in development

4. **Monitor API usage**
   - Set up usage alerts in OpenAI dashboard
   - Monitor for unusual activity

5. **Implement rate limiting**
   - Protect against abuse
   - Set reasonable limits per user/IP

## Database Security

### Connection Security

1. **Use SSL/TLS for database connections**
   ```
   DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
   ```

2. **Use strong passwords**
   - Minimum 16 characters
   - Mix of letters, numbers, and symbols
   - Never use default passwords

3. **Restrict database access**
   - Whitelist IP addresses
   - Use VPC/private networks in production
   - Limit user permissions

### Data Protection

1. **Never store sensitive data in plain text**
2. **Use Prisma's built-in SQL injection protection**
3. **Validate all user inputs**
4. **Sanitize data before storage**

## Deployment Security

### Vercel Deployment

1. **Add environment variables in Vercel dashboard:**
   - Project Settings → Environment Variables
   - Add separate values for Production, Preview, and Development

2. **Never commit production secrets:**
   - Use Vercel's secret management
   - Secrets are encrypted at rest

3. **Enable security headers:**
   - Already configured in `next.config.ts`
   - Content Security Policy
   - X-Frame-Options
   - X-Content-Type-Options

### Production Checklist

- [ ] All `.env*` files are in `.gitignore`
- [ ] Production API keys are set in deployment platform
- [ ] Database uses SSL/TLS connections
- [ ] Rate limiting is enabled
- [ ] Error messages don't expose sensitive information
- [ ] CORS is properly configured
- [ ] Security headers are enabled
- [ ] Dependencies are up to date
- [ ] Vulnerability scanning is enabled

## Incident Response

### If API Keys Are Compromised

1. **Immediately revoke the compromised key**
2. **Generate a new key**
3. **Update environment variables**
4. **Review access logs for unauthorized usage**
5. **Monitor for suspicious activity**
6. **Document the incident**

### If Database Is Compromised

1. **Immediately change database password**
2. **Review database access logs**
3. **Check for unauthorized data access**
4. **Notify affected users if personal data was accessed**
5. **Implement additional security measures**
6. **Document the incident**

## Code Security

### Input Validation

Always validate user input:

```typescript
// Bad
const result = await prisma.user.findUnique({
  where: { id: req.body.id }
})

// Good
const id = z.string().uuid().parse(req.body.id)
const result = await prisma.user.findUnique({
  where: { id }
})
```

### Error Handling

Never expose sensitive information in errors:

```typescript
// Bad
catch (error) {
  return res.json({ error: error.message })
}

// Good
catch (error) {
  console.error('Internal error:', error)
  return res.json({ 
    error: 'An error occurred. Please try again.' 
  })
}
```

### API Routes

Protect API routes:

```typescript
// Validate API keys
if (!process.env.OPENAI_API_KEY) {
  return NextResponse.json(
    { error: 'API key not configured' },
    { status: 500 }
  )
}

// Implement rate limiting
if (!checkRateLimit(clientId)) {
  return NextResponse.json(
    { error: 'Rate limit exceeded' },
    { status: 429 }
  )
}
```

## Monitoring and Logging

### What to Log

- API errors and failures
- Rate limit violations
- Authentication failures
- Database connection issues
- Unusual activity patterns

### What NOT to Log

- API keys or secrets
- User passwords
- Personal identifiable information (PII)
- Credit card numbers
- Session tokens

### Log Security

```typescript
// Bad
console.log('API Key:', process.env.OPENAI_API_KEY)

// Good
console.log('API request failed:', {
  endpoint: '/api/chat',
  status: 500,
  timestamp: new Date().toISOString()
})
```

## Dependencies

### Keep Dependencies Updated

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

### Review Dependencies

- Only use trusted packages
- Check package download counts and maintenance status
- Review security advisories
- Use `npm audit` regularly

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Prisma Security](https://www.prisma.io/docs/guides/security)
- [OpenAI API Best Practices](https://platform.openai.com/docs/guides/safety-best-practices)

## Contact

If you discover a security vulnerability, please email: [security@your-domain.com]

**Do not create public GitHub issues for security vulnerabilities.**
