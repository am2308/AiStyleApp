# StyleAI - AI-Powered Personal Stylist

StyleAI is a revolutionary AI-powered personal styling assistant that combines cutting-edge artificial intelligence with fashion expertise to transform how people discover, organize, and style their wardrobes.

## 🚀 Features

- **3D Virtual Try-On Technology** with photorealistic modeling
- **AI-Powered Outfit Recommendations** based on personal style
- **Smart Wardrobe Management** with digital organization
- **Marketplace Integration** for intelligent shopping suggestions
- **Social Style Sharing** with community features
- **Photo Try-On** to see how items look on you
- **Style Challenges** to engage with the community

## 🏗️ Architecture

StyleAI uses a fully serverless architecture on AWS:

- **Frontend**: React SPA hosted on S3 and delivered via CloudFront
- **Backend**: Express.js on AWS Lambda with API Gateway
- **Database**: DynamoDB for users and wardrobe items
- **Storage**: S3 for wardrobe item images
- **CDN**: CloudFront for global content delivery

This architecture provides:
- Automatic scaling to millions of users
- Pay-per-use pricing model
- Global availability with low latency
- High reliability and fault tolerance
- Minimal operational overhead

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Framer Motion for animations
- Three.js for 3D visualization
- Zappar for AR features

### Backend
- Node.js with Express
- AWS Lambda for serverless execution
- DynamoDB for data storage
- S3 for image storage
- JWT for authentication

## 📋 Getting Started

### Prerequisites
- Node.js 18+
- AWS account (for deployment)
- AWS CLI configured

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/styleai.git
   cd styleai
   ```

2. Start the local development environment:
   ```bash
   chmod +x scripts/local-dev.sh
   ./scripts/local-dev.sh
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api

### Deployment

For detailed deployment instructions, see [README-DEPLOYMENT.md](Readme-Styleai-Deployment.md).

Quick deployment:
```bash
# With custom domain
./scripts/deploy-all.sh --domain yourdomain.com --hosted-zone your-zone-id --certificate your-cert-arn

# Without custom domain
./scripts/deploy-all.sh
```

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgements

- [Pexels](https://www.pexels.com/) for providing free stock photos
- [Lucide Icons](https://lucide.dev/) for beautiful icons
- [Three.js](https://threejs.org/) for 3D rendering capabilities
- [Zappar](https://www.zappar.com/) for AR functionality
- [AWS](https://aws.amazon.com/) for serverless infrastructure
