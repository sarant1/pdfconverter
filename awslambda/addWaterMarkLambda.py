import json
import boto3

s3 = boto3.client('s3')

def lambda_handler(event, context):
    
    obj = s3.get_object(Bucket="docfilestobeconverted", Key="moneyovermoney")
    
    
    return {
        'statusCode': 200,
        'body': 'WHY AM I GETTING ACCESS DENIED?'
    }