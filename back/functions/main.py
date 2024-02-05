import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import request
import functions_framework
from firebase_admin import firestore, initialize_app

initialize_app()

@functions_framework.http
def verification(req: request) -> str:
    if request.method == 'POST':
        
        data = req.get_json()
        # Crea una referencia al cliente de Firestore
        db = firestore.client()
    
        user_email = data.get('email')
        
    # Recupera el correo electrónico del usuario desde la solicitud
       
       
          # Verificar si el usuario ya existe en la colección 'usernames'
        # Verificar si el correo electrónico ya existe en la colección 'usernames'
        existing_email = db.collection('usernames').where('email', '==', data.get('email')).stream()
        if len(list(existing_email)) > 0:    
    # Genera un código de verificación de 6 dígitos
            codigo_verificacion= ''.join([str(random.randint(0, 9)) for _ in range(6)])
            
            doc_id = list(existing_email)[0].id
    # Actualiza el campo 'verification_code' en el documento existente
            db.collection('usernames').document(doc_id).set({'verification_code': codigo_verificacion}, merge=True)
            
            
            smtp_server = 'smtp.outlook.com'  # Servidor SMTP
            smtp_port = 587  # Puerto SMTP para TLS/SSL
            smtp_username = 'linguasync@outlook.com'
            smtp_password = 'colomos2020'

            # Configura el mensaje de correo electrónico
            subject = 'Código de Verificación'
            sender_email = 'linguasync@outlook.com'  # Cambia esto a tu dirección de correo electrónico
            receiver_email = user_email
            message = MIMEMultipart()
            message['From'] = sender_email
            message['To'] = receiver_email
            message['Subject'] = subject

            # Cuerpo del mensaje
            body = f'Tu código de verificación es: {codigo_verificacion}'
            message.attach(MIMEText(body, 'plain'))

            # Conecta y envía el correo electrónico
            try:
                server = smtplib.SMTP(smtp_server, smtp_port)
                server.starttls()  # Inicia una conexión segura
                server.login(smtp_username, smtp_password)
                server.sendmail(sender_email, receiver_email, message.as_string())
                server.quit()
                return 'sucess'
            except Exception as e:
                return 'Error al enviar el correo electrónico: {}'.format(str(e))
            
            
        else:
            return 'El correo electrónico no esta registrado'
    else:
         return 'Methodo incorrecto'
            