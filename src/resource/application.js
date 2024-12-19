export default {
  // Appwrite Configuration
  appwrite: {
    endpoint: 'https://cloud.appwrite.io/v1',
    projectId: '67565ad30038ea4834b3',
    apiKey: 'standard_b86a6a04199eadc93d06a02e477749d98bf517d2227259ea0b6e3b38670319e9194ad4ad6c5d3e306fa528e69387ce21b5a3fcff3406e01bda7f29f698393aed17dca2053fda9d4f20a3882f889ccacb6c80cc68b66c701499ff07b101750381ad343caa3fd9236fa506104f32414739f3ab2dfcf03cb4c8402037cfd97e4b0f'
  },

  // Database Configuration
  database: {
    databaseId: '6761243a0025b0056e19',
    collectionId: '67612c4c002ab937009a'
  },

  // Server Configuration
  server: {
    port: 3000,
    environment: 'development'
  },

  // Backblaze B2 Configuration
  b2: {
    endpoint: 'https://s3.us-west-004.backblazeb2.com',
    region: 'us-west-004',
    keyId: '00517134353a3f60000000001',
    appKey: 'K005vLpD0xCwQGd68/vkbx6DVKBWQmA',
    bucketName: 'magic-logo-dev',
    publicUrl: 'https://your-bucket.s3.us-west-004.backblazeb2.com'
  },


  // JWT Configuration
  jwt: {
    secret: 'your_jwt_secret_key',
    expiresIn: '24h'
  }
}; 