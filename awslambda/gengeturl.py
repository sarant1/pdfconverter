import json
import boto3
from botocore.exceptions import ClientError

def create_presigned_url(pdfid):
    s3_client = boto3.client('s3')
    
    try:
        response = s3_client.generate_presigned_url('get_object', Params={
            'Bucket': 'converteddocs',
            'Key': pdfid},
            ExpiresIn=3600
        )
    except ClientError as e:
        logging.error(e)
        return None
    
    return response
def lambda_handler(event, context):
    
    pdfid = event["queryStringParameters"]['pdfid']
    response = create_presigned_url(pdfid)
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
        },
        'body': json.dumps({
            'message': 'success!',
            'signedurl': response
        })
    }
    