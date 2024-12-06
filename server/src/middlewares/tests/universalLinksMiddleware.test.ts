import { Request, Response } from 'express'
import {universalLinksMiddleware} from '../universalLinksMiddleware'

const mockNext = jest.fn()
const mockRedirect = jest.fn()

const getMockRequest = (params:Partial<Request> = {}) => ({...params, get: (name: string) => params.headers?.[name]}) as Request
const getMockResponse = (params:Partial<Response> = {}) => ({...params, redirect:mockRedirect}) as Response


describe('universalLinksMiddleware', () => {

    beforeEach(() => {
        mockRedirect.mockReset()
        mockNext.mockReset()
    })    
    
    it('should pass to next middleware if resource is not document', () => {
        const req = getMockRequest({headers:{}})
        const res = getMockResponse()

        universalLinksMiddleware(req, res, mockNext)
        expect(mockNext).toHaveBeenCalled()
    })

    it('should pass to next middleware if user agent is not iOS', () => {
        const req = getMockRequest({headers:{'Sec-Fetch-Dest':'document', 'User-Agent':'Android'}})
        const res = getMockResponse()

        universalLinksMiddleware(req, res, mockNext)
        expect(mockNext).toHaveBeenCalled()
    })

    it('should pass to next middleware if request is not coming from Instagram', () => {
        const req = getMockRequest({headers:{'Sec-Fetch-Dest':'document', 'User-Agent':'Mobile; iPad'}})
        const res = getMockResponse()

        universalLinksMiddleware(req, res, mockNext)
        expect(mockNext).toHaveBeenCalled()
    })

    it('should redirect with URL scheme if coming from Instagram / iOS', () => {
        const req = getMockRequest({headers:{'Sec-Fetch-Dest':'document', 'User-Agent':'Mobile; iPhone; Instagram',host:'passculture.app'}, originalUrl:'/offre/986?deeplink=true'})
        const res = getMockResponse()

        universalLinksMiddleware(req, res, mockNext)
        expect(mockRedirect).toHaveBeenCalledWith('app.passculture://offre/986?deeplink=true')
    })
})