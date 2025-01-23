interface WalrusConfig {
  publisherUrl: string
  aggregatorUrl: string
}

const WALRUS_CONFIG: WalrusConfig = {
  publisherUrl: "https://publisher.walrus-testnet.walrus.space",
  aggregatorUrl: "https://aggregator.walrus-testnet.walrus.space"
}

export const uploadToWalrus = async (file: File, epochs: number = 5): Promise<string> => {
  const uploadId = Date.now()
  
  // Initial validation logging
  console.log('=== Walrus Upload Validation ===')
  console.log('File validation:', {
    name: file.name,
    type: file.type,
    size: `${(file.size / 1024).toFixed(2)}KB`,
    isValidSize: file.size <= 5 * 1024 * 1024,  // 5MB limit
    isValidType: ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
  })

  // Size validation
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size exceeds 5MB limit')
  }

  try {
    console.log(`\n=== Walrus Upload Started (ID: ${uploadId}) ===`)
    console.time(`walrus-upload-${uploadId}`)

    // Request preparation logging
    const endpoint = `${WALRUS_CONFIG.publisherUrl}/v1/blobs?epochs=${epochs}`
    console.log('Preparing request:', {
      endpoint,
      method: 'PUT',
      contentType: file.type,
      fileSize: `${(file.size / 1024).toFixed(2)}KB`
    })

    // Making the request
    console.log('\nSending request to Walrus publisher...')
    const response = await fetch(endpoint, {
      method: 'PUT',
      body: file
    })

    // Response logging
    console.log('\nResponse received:', {
      status: response.status,
      statusText: response.statusText
    })

    if (response.status !== 200) {
      const errorText = await response.text()
      console.error('\nUpload failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      throw new Error('Something went wrong when storing the blob!')
    }

    // Parse response
    console.log('\nParsing response...')
    const result = await response.json()
    console.log('Response data:', result)

    // Extract blob ID based on response type
    console.log('\nExtracting blob ID...')
    let blobId: string
    
    if ('alreadyCertified' in result) {
      blobId = result.alreadyCertified.blobId
      console.log('Using already certified blob:', {
        status: 'Already certified',
        blobId,
        endEpoch: result.alreadyCertified.endEpoch
      })
    } else if ('newlyCreated' in result) {
      blobId = result.newlyCreated.blobObject.blobId
      console.log('Using newly created blob:', {
        status: 'Newly created',
        blobId,
        endEpoch: result.newlyCreated.blobObject.storage.endEpoch
      })
    } else {
      throw new Error('Unhandled successful response!')
    }

    // Generate final URL
    const imageUrl = `${WALRUS_CONFIG.aggregatorUrl}/v1/blobs/${blobId}`
    console.log('\nGenerated image URL:', imageUrl)

    console.timeEnd(`walrus-upload-${uploadId}`)
    console.log('=== Walrus Upload Completed ===\n')

    return imageUrl

  } catch (error) {
    console.error('\n=== Walrus Upload Error ===')
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      config: WALRUS_CONFIG,
      error
    })
    console.log('=== Walrus Upload Failed ===\n')
    
    throw new Error(error instanceof Error ? error.message : 'Failed to upload image')
  }
} 