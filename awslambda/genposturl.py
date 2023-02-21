import boto3
from botocore.exceptions import ClientError
import json
import uuid

client = boto3.client('s3')

pdfid = str(uuid.uuid4())


def lambda_handler(event, context):
    try:
        response = client.generate_presigned_post(
            'docfilestobeconverted',
            pdfid,
            ExpiresIn=3600
            )
    except ClientError as e:
        logging.error(e)
        return None
    return response
