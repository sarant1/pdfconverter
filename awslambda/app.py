import json
import boto3
from PyPDF4 import PdfFileReader, PdfFileWriter
from io import BytesIO

s3 = boto3.client('s3')

def put_watermark(input_page, watermark, key):

    watermark_instance = PdfFileReader(watermark)
    watermark_page = watermark_instance.getPage(0)

    input_pdf = PdfFileReader(input_page)
    pdf_writer = PdfFileWriter()

    # Merging watermark file with pdf doc
    for page in range(input_pdf.getNumPages()):
        page = input_pdf.getPage(page)
        page.mergePage(watermark_page)
        pdf_writer.addPage(page)
    
    pdf_output = BytesIO()
    pdf_writer.write(pdf_output)
    pdf_data = pdf_output.getvalue()
    pdf_output.close()

    s3.put_object(Bucket="converteddocs", Key=key, Body=pdf_data)
    

def lambda_handler(event, context):
    inputpdf = s3.get_object(Bucket='docfilestobeconverted', Key=event['pdfid'])
    watermark = s3.get_object(Bucket='docfilestobeconverted', Key='watermark.pdf')
    put_watermark(inputpdf, watermark, event["Key"])
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': 'Did it work yet?'
        })
    }
