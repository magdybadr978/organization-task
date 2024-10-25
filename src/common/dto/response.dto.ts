export class CreateResponse<T> {
  success : boolean
  data : T
}
export class UpdateResponse<T> {
  success : boolean
  data : T
}
export class GetOneResponse<T> {
  success : boolean
  data : T
}
export class GetAllResponse<T> {
  success : boolean
  data : T[]
}

export class DeleteResponse {
  success : boolean
}