import json
import boto3
from PyPDF4 import PdfFileReader, PdfFileWriter
import io

s3 = boto3.client('s3')

def put_watermark(bucketkey):
    
    # Grab the input files from s3 using uuid which is equal to bucketkey
    input_page = s3.get_object(Bucket='docfilestobeconverted', Key=bucketkey)
    watermark = s3.get_object(Bucket='docfilestobeconverted', Key='watermark.pdf')
    
    # setting s3 object to bytes so it can be manipulated
    input_page = io.BytesIO(input_page['Body'].read())
    watermark = io.BytesIO(watermark['Body'].read())

    # Reading of the watermark file
    watermark_instance = PdfFileReader(watermark)
    watermark_page = watermark_instance.getPage(0)
    
    # Reading of input file
    input_pdf = PdfFileReader(input_page)
    pdf_writer = PdfFileWriter()
    
    

    # Merging watermark file with pdf doc
    for page in range(input_pdf.getNumPages()):
        page = input_pdf.getPage(page)
        page.mergePage(watermark_page)
        pdf_writer.addPage(page)
    
    # This is saving the output file as pdf_data
    pdf_output = io.BytesIO()
    pdf_writer.write(pdf_output)
    pdf_data = pdf_output.getvalue()
    pdf_output.close()
    
    # Putting new watermarked object in converteddocs 
    s3.put_object(Bucket="converteddocs", Key=bucketkey, Body=pdf_data)
    
    

def lambda_handler(event, context):
    
    bucketkey = event["queryStringParameters"]['pdfid']
    put_watermark(bucketkey)
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': 'GET'
        },
        'body': json.dumps({
            'message': 'success!',
            'bucketkey': bucketkey
        })
    }
    
    
    
    
    
    
