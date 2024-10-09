import { verify } from 'jsonwebtoken';

function verifyToken(token, secretKey) {
    try {
        const result = verify(token, secretKey);
        return {
            email: result.email,
            id: result.id,
            role: result.role,
        };
    } catch (e) {
        return false;
    }
}

export { verifyToken };
