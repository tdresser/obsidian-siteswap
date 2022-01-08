# Siteswap Tests

## Implicit Pattern
```siteswap
5
```

## Explicit Pattern
```siteswap
pattern: 6
```

## \*'s Don't Break Anything
```siteswap
pattern: (4,2x)*
height: 400
scale: 0.5
```

## Additional Fields
```siteswap
pattern: 3
hands: (-25)(2.5).(25)(-2.5).(-25)(0).
colors: mixed
```

## YAML Parsing Failure
```siteswap
p:a:
```
