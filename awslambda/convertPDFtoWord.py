from PyPDF4 import PdfFileWriter, PdfFileReader
import PyPDF4


PyPDF4.PdfFileReader('Transcript.pdf')

def put_watermark(input_page, output_page, watermark):

    watermark_instance = PdfFileReader(watermark)
    watermark_page = watermark_instance.getPage(0)

    input_pdf = PdfFileReader(input_page)
    pdf_writer = PdfFileWriter()


    for page in range(input_pdf.getNumPages()):

        page = input_pdf.getPage(page)

        page.mergePage(watermark_page)

        pdf_writer.addPage(page)

    with open(output_page, 'wb') as out:
        pdf_writer.write(out)

if __name__ == "__main__":
    put_watermark(
        input_page='Transcript.pdf',
        output_page='watermark_added1.pdf',
        watermark='watermark.pdf'
    )
