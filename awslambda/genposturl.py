import boto3
from botocore.exceptions import ClientError
import json

client = boto3.client('s3')

def lambda_handler(event, context):
    try:
        response = client.generate_presigned_url(
            Bucket="docfilestobeconverted",
            Key='moneyovereverthing',
            ExpiresIn=300
            )
    except ClientError as e:
        print(e)
        return None
    return {
        'statusCode': 200,
        'body': response
        
    }
