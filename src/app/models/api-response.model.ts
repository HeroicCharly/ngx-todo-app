import { Observable } from 'rxjs/Observable';

/** Represents a response from the server. */
export interface JSendReply<T> {
    /** Data of type T that the response contains. */
    data: T;
    /** Any additional message regarding the request. */
    message: string;
    /** Status of the request. */
    status: string;
    /** HTTP status code of the request. */
    statusCode: number;
}

export interface ApiResponse<T> extends Observable<JSendReply<T>> { }