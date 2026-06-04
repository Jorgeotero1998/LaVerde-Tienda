# Security Policy

## Reporting a Vulnerability
If you discover a security vulnerability, please open a GitHub Issue or contact the maintainers directly.

## Supported Versions
| Version | Supported |
| ------- | --------- |
| 1.0.x   | Yes       |

## Security practices in this project
- JWT authentication on all protected routes
- Password hashing with Werkzeug
- Environment variables for all secrets
- Data isolation between users verified by automated tests
