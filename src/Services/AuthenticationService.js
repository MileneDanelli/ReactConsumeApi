import crypto from 'crypto'
import axios from 'axios'

export default class AuthenticationService {
    constructor () {
        this.http = axios
    }

    async doLogin (user, pass) {
        try {
            const md5Pass = crypto
                .createHash('md5')
                .update(pass)
                .digest('hex') // Cria um MD5 da senha
            const {nonce, encodedData} = this._encrypt(`${user} ${pass}`) // encripta com AES
            const requestOptions = {
                headers: {
                    Authorization: `Bearer ${encodedData}`,
                    'X-Nonce': nonce
                },
                validateStatus: (status) => status < 500
            }
            const {data: jwt, status} = await this.http.get(`http://localhost:8080/auth`, requestOptions)
            if (status === 401) throw new Error('Email ou senha inválidos')
            return jwt
        } catch (err) {
            throw err
        }
    }

    _encrypt (data) {
        try {
            const passHash = crypto
                .createHash('md5')
                .update(process.env.REACT_APP_CLIENT_ID, 'utf-8')
                .digest('hex')
                .toUpperCase()
            const nonce = Buffer.alloc(16, Math.random().toString(36).substr(7))
            const alg = 'aes-256-cbc'
            const cipher = crypto.createCipheriv(alg, passHash, nonce)
            return {
                nonce: nonce.toString('base64'),
                encodedData: cipher.update(data, 'utf-8', 'hex') + cipher.final('hex')
            }
        } catch (err) {
            throw err
        }
    }
}
