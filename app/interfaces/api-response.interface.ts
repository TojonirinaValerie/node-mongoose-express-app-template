import { DataResponse } from "./data-response.interface"

export interface ApiResponse {
    succes: boolean
    message: string
    data?: DataResponse
}