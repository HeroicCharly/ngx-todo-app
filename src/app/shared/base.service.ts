import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { JSendReply, ApiResponse } from 'app/models';

export class BaseService {
  protected url: string;

  /**
   * Use the base service class to create your services.
   * @param http Angular HTTP service.
   * @param prefix Prefix to use with the service. For example: 'auth';
   */
  constructor(private _http: Http, prefix: string) {
    // Use this property to populate your API base URL
    this.url = '';
  }

  /**
   * Triggers a HTTP GET to the server with the specified endpoint and query parameters.
   * @param [endpoint=''] The endpoint to GET from. Defaults to empty string.
   * @param [queryParams] Any data to be sent to the server. Keys must match query parameter name.
   * @returns An observable in the format of ApiResponse<T>.
   */
  protected get<T>(endpoint: string = '', queryParams?: object): ApiResponse<T> {
    const requestUrl = `${this.url}/${endpoint}`;
    // search is the property name that it's used to send queryParams.
    const search = this.transformParameters(queryParams);

    return this._http
      .get(requestUrl, { search })
      .map(res => this.extractData<T>(res))
      .catch(this.errorHandler);
  }

  /**
   * Triggers a HTTP GET to the specified URL and query parameters.
   * @param url URL of the service to call.
   * @param [queryParams] Any data to be sent to the server. Keys must match query parameter name.
   * @returns An observable in the format of ApiResponse<T>.
   */
  protected getExternal<T>(url: string, queryParams?: object): ApiResponse<T> {
    const search = this.transformParameters(queryParams);

    return this._http
      .get(url, { search })
      .map(res => this.extractData<T>(res))
      .catch(this.errorHandler);
  }

  /**
   * Triggers a HTTP POST to the server with the specified endpoint and data.
   * @param [endpoint=''] The endpoint to POST to. Defaults to empty string.
   * @param [data=null] Any data to be sent to the server.
   * @returns An observable in the format of ApiResponse<T>.
   */
  protected post<T>(endpoint: string = '', data: any = null): ApiResponse<T> {
    return this._http
      .post(`${this.url}/${endpoint}`, data)
      .map(res => this.extractData<T>(res))
      .catch(this.errorHandler);
  }

  /**
   * Triggers a HTTP PUT to the server with the specified endpoint and query parameters.
   * @param [endpoint=''] The endpoint to PUT at. Defaults to empty string.
   * @param [data=null] Any data to be sent to the server.
   * @returns An observable in the format of ApiResponse<T>.
   */
  protected put<T>(endpoint: string = '', data: any = null): ApiResponse<T> {
    return this._http
      .put(`${this.url}/${endpoint}`, data)
      .map(res => this.extractData<T>(res))
      .catch(this.errorHandler);
  }

  /**
   * Triggers a HTTP DELETE to the server with the specified endpoint and query parameters.
   * @param [endpoint=''] The endpoint to DELETE from. Defaults to empty string.
   * @param [queryParams] Any data to be sent to the server. Keys must match query parameter name.
   * @returns An observable in the format of ApiResponse<T>.
   */
  protected delete<T>(endpoint: string = '', queryParams?: object): ApiResponse<T> {
    const search = this.transformParameters(queryParams);

    return this._http
      .delete(`${this.url}/${endpoint}`, { search })
      .map(res => this.extractData<T>(res))
      .catch(this.errorHandler);
  }

  /**
   * Extracts the data from the HTTP request.
   * @param res Response from the HTTP call.
   * @returns The json response in JSend format.
   */
  protected extractData<T>(res: Response): JSendReply<T> {
    return res.json() || {};
  }

  /**
   * Parses the json response while throwing it as an error.
   * This is for bubbling up the error from the first Observable to its implementation.
   * @param err Response object containing the error details from the API.
   */
  protected errorHandler(err: Response): Observable<JSendReply<any>> {
    let body = err.json() as JSendReply<any>;
    return Observable.throw(body);
  }

  /**
   * Transforms the given object into a URLSearchparams object.
   * This is intended to be executed before a GET request.
   * @param obj Object containing the data to be transformed.
   * @returns URLSearchParams object containing the data to send.
   */
  private transformParameters(obj: object): URLSearchParams {
    let urlSearchParams = new URLSearchParams();
    for (let property in obj) {
      let parameter = obj[property];

      if (parameter instanceof Date) {
        let dateParam = parameter.toDateString();
        urlSearchParams.set(property, dateParam);
      } else if (typeof parameter === 'object' && !Array.isArray(parameter)) {
        urlSearchParams.appendAll(this.transformParameters(parameter));
      } else if (Array.isArray(parameter)) {
        parameter.forEach(value => urlSearchParams.append(property, value));
      } else {
        urlSearchParams.set(property, parameter);
      }
    }

    return urlSearchParams;
  }
}
