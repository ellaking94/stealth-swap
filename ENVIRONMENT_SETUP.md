# Environment Variables Setup Guide

## WalletConnect Project ID Setup

### Step 1: Create WalletConnect Project

1. **Visit WalletConnect Cloud**:
   - Go to [cloud.walletconnect.com](https://cloud.walletconnect.com)
   - Sign up or log in with your account

2. **Create New Project**:
   - Click "Create Project"
   - Enter project details:
     - **Project Name**: `Stealth Swap`
     - **Project Description**: `Private Cross-Chain Bridge with FHE`
     - **Project URL**: `https://stealth-swap.vercel.app` (or your domain)
     - **Project Logo**: Upload your project logo

3. **Get Project ID**:
   - After creating the project, you'll see a Project ID
   - Copy this ID (it looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### Step 2: Configure Vercel Environment Variables

1. **In Vercel Dashboard**:
   - Go to your project: `stealth-swap`
   - Click "Settings" tab
   - Click "Environment Variables"

2. **Add Environment Variables**:
   - Click "Add New"
   - Enter the following:
     ```
     Name: VITE_WALLETCONNECT_PROJECT_ID
     Value: [Your WalletConnect Project ID from Step 1]
     Environment: Production, Preview, Development
     ```
   - Click "Save"

3. **Important**: Do NOT add environment variables to vercel.json file. Add them directly in the Vercel Dashboard.

4. **Add Contract Addresses** (when deployed):
   ```
   Name: VITE_CONTRACT_ADDRESS_SEPOLIA
   Value: 0x[Your Contract Address]
   Environment: Production, Preview, Development
   
   Name: VITE_CONTRACT_ADDRESS_MAINNET
   Value: 0x[Your Contract Address]
   Environment: Production, Preview, Development
   
   Name: VITE_CONTRACT_ADDRESS_POLYGON
   Value: 0x[Your Contract Address]
   Environment: Production, Preview, Development
   
   Name: VITE_CONTRACT_ADDRESS_ARBITRUM
   Value: 0x[Your Contract Address]
   Environment: Production, Preview, Development
   
   Name: VITE_CONTRACT_ADDRESS_OPTIMISM
   Value: 0x[Your Contract Address]
   Environment: Production, Preview, Development
   ```

### Step 3: Update Local Development

Create a `.env.local` file in your project root:

```bash
# .env.local
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
VITE_CONTRACT_ADDRESS_SEPOLIA=0x...
VITE_CONTRACT_ADDRESS_MAINNET=0x...
VITE_CONTRACT_ADDRESS_POLYGON=0x...
VITE_CONTRACT_ADDRESS_ARBITRUM=0x...
VITE_CONTRACT_ADDRESS_OPTIMISM=0x...
```

### Step 4: Redeploy

After adding environment variables:

1. **Redeploy in Vercel**:
   - Go to "Deployments" tab
   - Click "Redeploy" on the latest deployment
   - Or push a new commit to trigger automatic deployment

2. **Verify Environment Variables**:
   - Check the deployment logs to ensure variables are loaded
   - Test wallet connection functionality

## Temporary Solution for Testing

If you want to test the application without WalletConnect for now, you can:

1. **Update wagmi.ts** to use a placeholder:
   ```typescript
   export const config = getDefaultConfig({
     appName: 'Stealth Swap',
     projectId: 'placeholder-project-id', // Temporary placeholder
     chains: [mainnet, sepolia, polygon, arbitrum, optimism],
     ssr: false,
   });
   ```

2. **Deploy and test** basic functionality
3. **Add real WalletConnect Project ID** when ready for production

## Important Notes

- **Never commit** `.env.local` to git
- **Use different Project IDs** for development and production
- **Keep Project IDs secure** - they're used for wallet connections
- **Test thoroughly** after adding environment variables

## Troubleshooting

### Common Issues:

1. **"Project ID not found"**:
   - Verify the Project ID is correct
   - Check environment variable name matches exactly
   - Ensure variable is set for the correct environment

2. **Wallet connection fails**:
   - Check browser console for errors
   - Verify network configuration
   - Ensure wallet is installed and unlocked

3. **Environment variables not loading**:
   - Redeploy the application
   - Check Vercel deployment logs
   - Verify variable names start with `VITE_`
