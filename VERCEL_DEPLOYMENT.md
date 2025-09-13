# Vercel Deployment Guide for Stealth Swap

This guide provides step-by-step instructions for deploying the Stealth Swap application to Vercel.

## Prerequisites

- Vercel account (free tier available)
- GitHub repository access
- Node.js 18+ installed locally (for testing)

## Step-by-Step Deployment Instructions

### 1. Prepare the Project

1. **Verify the project structure**:
   ```
   stealth-swap/
   ├── src/
   ├── public/
   ├── contracts/
   ├── package.json
   ├── vite.config.ts
   └── README.md
   ```

2. **Test locally** (optional but recommended):
   ```bash
   cd stealth-swap
   npm install
   npm run dev
   ```

### 2. Deploy to Vercel

#### Method 1: Using Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**:
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose `ellaking94/stealth-swap` from the list
   - Click "Import"

3. **Configure Project Settings**:
   - **Project Name**: `stealth-swap` (or your preferred name)
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables** (if needed):
   - Click "Environment Variables"
   - Add any required environment variables:
     ```
     VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
     VITE_CONTRACT_ADDRESS_SEPOLIA=0x...
     VITE_CONTRACT_ADDRESS_MAINNET=0x...
     ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete (usually 2-3 minutes)

#### Method 2: Using Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project directory**:
   ```bash
   cd stealth-swap
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project: No
   - Project name: `stealth-swap`
   - Directory: `./`
   - Override settings: No

### 3. Configure Custom Domain (Optional)

1. **In Vercel Dashboard**:
   - Go to your project
   - Click "Settings" tab
   - Click "Domains"

2. **Add Custom Domain**:
   - Enter your domain name
   - Follow DNS configuration instructions
   - Wait for SSL certificate to be issued

### 4. Configure Build Settings

1. **In Vercel Dashboard**:
   - Go to your project
   - Click "Settings" tab
   - Click "General"

2. **Build & Development Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Development Command**: `npm run dev`

### 5. Environment Variables Configuration

Add the following environment variables in Vercel Dashboard:

```
# WalletConnect Project ID (get from walletconnect.com)
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Contract addresses for different networks
VITE_CONTRACT_ADDRESS_SEPOLIA=0x...
VITE_CONTRACT_ADDRESS_MAINNET=0x...
VITE_CONTRACT_ADDRESS_POLYGON=0x...
VITE_CONTRACT_ADDRESS_ARBITRUM=0x...
VITE_CONTRACT_ADDRESS_OPTIMISM=0x...

# Optional: Analytics and monitoring
VITE_ANALYTICS_ID=your_analytics_id
```

### 6. Automatic Deployments

1. **Enable Auto-Deployments**:
   - Vercel automatically deploys on every push to main branch
   - Preview deployments are created for pull requests

2. **Branch Protection**:
   - Go to GitHub repository settings
   - Enable branch protection for main branch
   - Require pull request reviews before merging

### 7. Performance Optimization

1. **Enable Vercel Analytics**:
   - In Vercel Dashboard, go to "Analytics" tab
   - Enable Web Analytics

2. **Configure Edge Functions** (if needed):
   - Create `api/` directory in your project
   - Add serverless functions for backend operations

### 8. Monitoring and Maintenance

1. **Monitor Deployments**:
   - Check deployment logs in Vercel Dashboard
   - Monitor performance metrics
   - Set up alerts for failed deployments

2. **Update Dependencies**:
   - Regularly update npm packages
   - Test updates in preview deployments
   - Deploy to production after testing

## Important Configuration Notes

### Build Configuration

The project uses Vite as the build tool. Key configuration files:

- `vite.config.ts`: Vite configuration
- `package.json`: Dependencies and scripts
- `tsconfig.json`: TypeScript configuration

### Wallet Integration

The application uses RainbowKit for wallet connectivity:

- **Supported Wallets**: MetaMask, Rainbow, WalletConnect, Coinbase Wallet
- **Supported Networks**: Ethereum, Polygon, Arbitrum, Optimism, Sepolia
- **Privacy Features**: FHE encryption for transaction amounts

### Smart Contract Integration

- **FHE Contracts**: Deployed on supported networks
- **Contract Addresses**: Configured via environment variables
- **Privacy Protection**: All sensitive data encrypted using FHE

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version (requires 18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Wallet Connection Issues**:
   - Verify WalletConnect Project ID
   - Check network configurations
   - Ensure contract addresses are correct

3. **Deployment Issues**:
   - Check Vercel build logs
   - Verify environment variables
   - Ensure all required files are committed

### Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vite Documentation**: [vitejs.dev](https://vitejs.dev)
- **RainbowKit Documentation**: [rainbowkit.com](https://rainbowkit.com)

## Security Considerations

1. **Environment Variables**: Never commit sensitive keys to repository
2. **Contract Verification**: Verify smart contracts on block explorers
3. **Access Control**: Implement proper access controls for admin functions
4. **Privacy**: Ensure FHE encryption is properly implemented

## Post-Deployment Checklist

- [ ] Verify application loads correctly
- [ ] Test wallet connection functionality
- [ ] Verify cross-chain bridge operations
- [ ] Check privacy features are working
- [ ] Monitor performance and error rates
- [ ] Set up monitoring and alerts
- [ ] Configure custom domain (if applicable)
- [ ] Enable analytics and monitoring
- [ ] Test on different devices and browsers

## Deployment URL

After successful deployment, your application will be available at:
- **Production**: `https://stealth-swap.vercel.app` (or your custom domain)
- **Preview**: `https://stealth-swap-git-[branch].vercel.app` (for branch deployments)

## Next Steps

1. **Smart Contract Deployment**: Deploy FHE contracts to supported networks
2. **Liquidity Provision**: Add initial liquidity for bridge operations
3. **Security Audit**: Conduct security audit of smart contracts
4. **User Testing**: Gather feedback from beta users
5. **Feature Enhancements**: Add additional privacy features and optimizations
