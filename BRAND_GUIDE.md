# Stealth Swap Brand Guide

## Logo Design

### Primary Logo
- **File**: `/public/logo.svg`
- **Size**: 120x120px
- **Usage**: Main brand logo for headers, marketing materials, and large displays

### Icon Logo
- **File**: `/public/logo-icon.svg`
- **Size**: 32x32px
- **Usage**: Browser favicon, app icons, small UI elements

### Favicon
- **File**: `/public/favicon.svg`
- **Size**: 32x32px
- **Usage**: Browser tab icon, bookmarks

## Design Elements

### Color Palette
- **Primary Gradient**: Blue to Purple to Pink to Orange
  - Blue: `#1E40AF` (Deep Blue)
  - Light Blue: `#3B82F6` (Bright Blue)
  - Purple: `#8B5CF6` (Violet)
  - Pink: `#EC4899` (Hot Pink)
  - Orange: `#F59E0B` (Amber)

### Key Visual Elements
1. **Shield**: Represents security and protection
2. **Bridge Lines**: Symbolize cross-chain connectivity
3. **Chain Nodes**: Represent blockchain networks
4. **Lock Icon**: Emphasizes privacy and encryption
5. **Encryption Dots**: Visual representation of data encryption

### Design Philosophy
- **Stealth**: Hidden, private, encrypted
- **Bridge**: Connection between chains
- **Security**: Shield and lock elements
- **Modern**: Gradient colors and clean lines
- **Professional**: Suitable for DeFi and enterprise use

## Usage Guidelines

### Logo Placement
- Always maintain clear space around the logo
- Minimum clear space: 1x the height of the shield
- Do not place on busy backgrounds
- Ensure sufficient contrast

### Color Variations
- **Primary**: Full gradient version (preferred)
- **Monochrome**: White version for dark backgrounds
- **Single Color**: Blue version for single-color applications

### Sizing
- **Minimum Size**: 24px height for digital use
- **Recommended Sizes**: 32px, 48px, 64px, 120px
- **Maximum Size**: No limit, but maintain proportions

## Brand Voice

### Tone
- **Professional**: Enterprise-grade security
- **Innovative**: Cutting-edge FHE technology
- **Trustworthy**: Reliable cross-chain bridge
- **Private**: Privacy-first approach

### Key Messages
- "Private Cross-Chain Bridge"
- "FHE-Encrypted Transactions"
- "Zero-Knowledge Privacy"
- "Secure Asset Transfers"

## Technical Specifications

### File Formats
- **SVG**: Preferred for web and scalable applications
- **PNG**: For applications requiring raster images
- **ICO**: For Windows favicon compatibility

### Browser Compatibility
- Modern browsers support SVG favicons
- Fallback to ICO for older browsers
- Apple Touch Icon for iOS devices

## Implementation

### HTML Implementation
```html
<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/logo-icon.svg" />

<!-- Logo in Header -->
<img src="/logo-icon.svg" alt="Stealth Swap Logo" className="w-8 h-8" />
```

### React Component
```tsx
const Logo = ({ size = 32, className = "" }) => (
  <img 
    src="/logo-icon.svg" 
    alt="Stealth Swap Logo" 
    className={`w-${size} h-${size} ${className}`}
  />
);
```

## Brand Consistency

### Do's
- ✅ Use the official gradient colors
- ✅ Maintain proper proportions
- ✅ Ensure adequate contrast
- ✅ Use appropriate file formats
- ✅ Include proper alt text

### Don'ts
- ❌ Modify the gradient colors
- ❌ Distort the logo proportions
- ❌ Use on low-contrast backgrounds
- ❌ Combine with other logos
- ❌ Use outdated versions

## Contact

For brand usage questions or logo requests, please contact the development team.

---

*This brand guide ensures consistent representation of the Stealth Swap brand across all touchpoints.*
