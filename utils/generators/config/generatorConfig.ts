export type GlucoseGeneratorConfig = {
  average: number
  min: number
  max: number
  maxChange: number
}

export const StableGeneratorConfig: GlucoseGeneratorConfig = {
  average: 100,
  min: 80,
  max: 150,
  maxChange: 5,
}

export const TrendsHighGeneratorConfig: GlucoseGeneratorConfig = {
  average: 150,
  min: 120,
  max: 250,
  maxChange: 8,
}

export const RealisticGeneratorConfig: GlucoseGeneratorConfig = {
  average: 130,
  min: 55,
  max: 350,
  maxChange: 8,
} 