import { HikingFormData } from '@/types'
import dayjs from 'dayjs'

/**
 * Processes a GPX file and extracts hiking data
 */
export async function processGpxFile(file: File): Promise<Partial<HikingFormData>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = async (e) => {
      try {
        if (!e.target?.result) throw new Error('Failed to read file')
        
        const gpxContent = e.target.result as string
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(gpxContent, 'text/xml')
        
        // Extract track points
        const trackPoints = Array.from(xmlDoc.getElementsByTagName('trkpt'))
        if (trackPoints.length === 0) throw new Error('No track points found in GPX file')
        
        // Calculate elevation
        const elevations = trackPoints
          .map(point => Number(point.getElementsByTagName('ele')[0]?.textContent || 0))
          .filter(ele => !isNaN(ele))
        
        const maxElevation = Math.max(...elevations)
        
        // Calculate time
        const times = trackPoints
          .map(point => point.getElementsByTagName('time')[0]?.textContent)
          .filter(Boolean)
          .map(time => dayjs(time))
        
        const startTime = times[0]
        const endTime = times[times.length - 1]
        const duration = endTime.diff(startTime, 'second')
        
        // Calculate distance
        let totalDistance = 0
        for (let i = 1; i < trackPoints.length; i++) {
          const prev = trackPoints[i - 1]
          const curr = trackPoints[i]
          
          const lat1 = Number(prev.getAttribute('lat'))
          const lon1 = Number(prev.getAttribute('lon'))
          const lat2 = Number(curr.getAttribute('lat'))
          const lon2 = Number(curr.getAttribute('lon'))
          
          totalDistance += calculateDistance(lat1, lon1, lat2, lon2)
        }
        
        resolve({
          maxElevation: Math.round(maxElevation),
          date: startTime,
          startTime: startTime.format('HH:mm'),
          endTime: endTime.format('HH:mm'),
          duration,
          totalDistance: Math.round(totalDistance * 1000), // Convert km to m
          gpxFile: file
        })
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read GPX file'))
    reader.readAsText(file)
  })
}

/**
 * Calculates distance between two points using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * Math.PI / 180
}

export const parseGpxData = (gpxContent: string) => {
  const parser = new DOMParser()
  const gpx = parser.parseFromString(gpxContent, 'text/xml')
  
  const parseError = gpx.getElementsByTagName('parsererror')
  if (parseError.length > 0) {
    throw new Error('Invalid GPX file format')
  }

  const trackPoints = Array.from(gpx.getElementsByTagName('trkpt'))
  if (trackPoints.length === 0) {
    throw new Error('No track points found in GPX file')
  }

  const elevations = trackPoints
    .map(point => {
      const ele = point.getElementsByTagName('ele')[0]
      return Math.floor(parseFloat(ele?.textContent || '0'))
    })
  const maxElevation = Math.max(...elevations, 0)

  const times = trackPoints
    .map(point => point.getElementsByTagName('time')[0]?.textContent || '')
    .filter(Boolean)
  
  const startTime = times[0] || new Date().toISOString()
  const endTime = times[times.length - 1] || new Date().toISOString()

  let totalDistance = 0
  for (let i = 1; i < trackPoints.length; i++) {
    const [prev, curr] = [trackPoints[i - 1], trackPoints[i]]
    const [lat1, lon1] = [parseFloat(prev.getAttribute('lat') || '0'), parseFloat(prev.getAttribute('lon') || '0')]
    const [lat2, lon2] = [parseFloat(curr.getAttribute('lat') || '0'), parseFloat(curr.getAttribute('lon') || '0')]
    
    const R = 6371e3
    const φ1 = lat1 * Math.PI/180
    const φ2 = lat2 * Math.PI/180
    const Δφ = (lat2-lat1) * Math.PI/180
    const Δλ = (lon2-lon1) * Math.PI/180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2)
    totalDistance += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  }

  return {
    maxElevation,
    totalDistance: Math.round(totalDistance),
    startTime,
    endTime
  }
} 