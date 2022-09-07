import requests, json

from base.utils.X_API_KEY import X_API_KEY
from base.models import Idpay

IDPAY_HEADER = {
    'Content-Type':'application/json',
    'X-API-KEY':X_API_KEY,
    'X-SANDBOX':'1'
}


def idpayCreatePay(user, order):
    body = {
        'order_id' : str(order._id),
        'amount': int(order.totalPrice * 10),
        'mail' : user.email,
        'callback' : 'http://127.0.0.1:8000/api/v1/air/result/'
    }
    
    response = requests.post(
        'https://api.idpay.ir/v1.1/payment',
        data=json.dumps(body),
        headers = IDPAY_HEADER,
    )
    
    return response


def idpayCreateDB(user, order, id):
    try:
        idpay = Idpay.objects.create(
            user = user,
            order = order,
            transId = id,
            lastStatus = 0 ,
            amountCreate = (order.totalPrice * 10)
        )
        return True
    except:
        return False
        