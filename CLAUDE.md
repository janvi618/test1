# CLAUDE.md - AI Assistant Guidelines for test1

This file provides guidance for AI assistants (like Claude) working with this repository.

## Repository Overview

**Project:** test1
**Status:** Minimal/template repository
**Created:** October 2015

This is currently a minimal placeholder repository with no application code. It serves as a starting point for development.

## Current Structure

```
test1/
├── .git/           # Git version control
├── CLAUDE.md       # AI assistant guidelines (this file)
└── README.md       # Project documentation
```

## Git Workflow

### Branch Strategy

- **Main branch:** Primary development branch
- **Feature branches:** Create feature branches for new work
- **Naming convention:** Use descriptive branch names (e.g., `feature/add-login`, `fix/auth-bug`)

### Commit Guidelines

- Write clear, descriptive commit messages
- Use imperative mood (e.g., "Add feature" not "Added feature")
- Keep commits focused and atomic
- Reference issues in commit messages when applicable

### Common Git Commands

```bash
# Check status
git status

# Stage changes
git add <file>

# Commit changes
git commit -m "Description of changes"

# Push to remote
git push -u origin <branch-name>
```

## Development Guidelines

### When Adding New Code

1. **Choose appropriate structure:** Organize code logically by feature or function
2. **Add configuration files:** Include relevant config files (package.json, requirements.txt, etc.)
3. **Document as you go:** Update README.md with setup instructions
4. **Add tests:** Include tests alongside new functionality

### Code Style Conventions

When code is added to this repository, follow these general principles:

- Use consistent indentation (spaces preferred, typically 2 or 4)
- Write self-documenting code with clear variable/function names
- Add comments only where logic isn't self-evident
- Keep functions small and focused
- Avoid over-engineering; implement only what's needed

### File Organization Best Practices

```
project/
├── src/            # Source code
├── tests/          # Test files
├── docs/           # Documentation
├── config/         # Configuration files
└── scripts/        # Utility scripts
```

## AI Assistant Instructions

### Before Making Changes

1. Read existing code to understand context
2. Check for existing patterns and conventions
3. Review any existing tests
4. Understand the scope of requested changes

### When Implementing Features

1. Make minimal, focused changes
2. Follow existing code style and patterns
3. Avoid adding unnecessary dependencies
4. Don't over-engineer solutions
5. Test changes when possible

### What to Avoid

- Don't add features beyond what's requested
- Don't refactor unrelated code
- Don't add excessive comments or documentation
- Don't introduce security vulnerabilities
- Don't make breaking changes without discussion

## Testing

Currently no testing framework is configured. When adding tests:

1. Choose an appropriate testing framework for the language/stack
2. Place tests in a dedicated `tests/` directory
3. Follow naming conventions (e.g., `test_*.py`, `*.test.js`)
4. Aim for meaningful test coverage, not 100% coverage

## Documentation

### README.md

Keep the README updated with:
- Project description
- Setup/installation instructions
- Usage examples
- Contributing guidelines (if applicable)

### Code Documentation

- Use docstrings/JSDoc for public APIs
- Keep inline comments minimal and meaningful
- Document non-obvious design decisions

## Security Considerations

- Never commit secrets, API keys, or credentials
- Use environment variables for sensitive configuration
- Review dependencies for known vulnerabilities
- Validate all user inputs at system boundaries

## Future Development

As this repository grows, update this CLAUDE.md to reflect:

- Specific build and deployment processes
- Project-specific coding standards
- Testing requirements and coverage goals
- CI/CD pipeline configuration
- Environment setup instructions

---

*Last updated: February 2026*
