export type Stroke = [number, number, number, string]

export interface Drawing {
  title: string
  stroke_data: Stroke[] | string
}
