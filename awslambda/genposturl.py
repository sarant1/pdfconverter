import boto3
from botocore.exceptions import ClientError
import json

client = boto3.client('s3')

def lambda_handler(event, context):
    try:
        response = client.generate_presigned_post(
            'docfilestobeconverted',
            'moneyovermoney',
            ExpiresIn=3600
            )
    except ClientError as e:
        logging.error(e)
        return None
    return response

