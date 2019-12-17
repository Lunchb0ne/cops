import urllib.request
import cv2
import numpy as np
import time
import io
import re
import os
import sys
import subprocess
import pyrebase
import datetime
import geocoder
from google.cloud import vision
from google.cloud.vision import types

# Config for Firebase Database
config = {
   
}

firebase = pyrebase.initialize_app(config)

# Create a database
db = firebase.database()

# Initializing SetTime
settime = 0.0

# Create RE object
tester = re.compile(
    "^[ABCDEFGHIJKLMNOPQRSTUVWXYZ]{2} *[0123456789]{1,2} *[ABCDEFGHIJKLMNOPQRSTUVWXYZ ]{1,5} *[0123456789]{4}$")

# Detects text in the file.


def detect_text(img):
    global settime
    client = vision.ImageAnnotatorClient()

    with io.open(img, 'rb') as image_file:
        content = image_file.read()

    image = vision.types.Image(content=content)

    response = client.text_detection(image=image)
    texts = response.text_annotations

    # print('Texts:')
    for text in texts:
        print("Unfiltered Text:")
        print('"{}"'.format(text.description))
        print()
        if type(tester.match(text.description)) != type(re.match('a', 'bcd')) and '\n' not in text.description:
            finalnumber = '\n"{}"'.format(text.description).strip()
            print("********* Filtered Text: *********")
            print(finalnumber)
            print()

            lis = list(geocoder.ip('me').latlng)

            curtime = time.time()
            data = {
                ("CarsLog/{0}/{1}/").format(str(finalnumber), str(int(curtime))): {
                    "Location": geocoder.ip('me').latlng,
                    "DateTime": str(datetime.datetime.now())
                }
            }

            if curtime - settime >= 20:
                settime = curtime
                db.update(data)
                time.sleep(2)
            else:
                print(curtime - settime)

        # print('\n"{}"'.format(text.description))

        # vertices = (['({},{})'.format(vertex.x, vertex.y)
        #             for vertex in text.bounding_poly.vertices])

        # print('bounds: {}'.format(','.join(vertices)))


# URL of IP Webcam, IP Address:Respective Port/shot.jpg
# Enter URL for stream from IPWebcam
url = 'http://192.168.43.104:8080/shot.jpg'

i = 0
while True:
    # try:
        # print(i)
    if i == 100:
        break

    # Use urllib to get the image from the IP camera
    imgResp = urllib.request.urlopen(url)

    # Saving image locally in the same directory
    urllib.request.urlretrieve(url, 'img.jpg')

    os.rename('img.jpg', ('img({}).jpg').format(i))

    # Detect Text on the image retrieved
    img = ('img({}).jpg').format(i)
    detect_text(img)

    # Time

    i += 1

    # Numpy to convert into a array
    imgNp = np.array(bytearray(imgResp.read()), dtype=np.uint8)

    # Finally decode the array to OpenCV usable format ;)
    imgTrue = cv2.imdecode(imgNp, -1)

    # Resize your image window
    imgRe = cv2.resize(imgTrue, (960, 540))

    # Put the image on screen
    cv2.imshow('IPWebcam', imgRe)

    # To give the processor some less stress
    # time.sleep(0.00033)

    # Quit if q is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

    # Externally ending the stream
    # except:
    #     print("Stream Ended.")
    #     break
    #     sys.exit()
#os.rename('Imgs/img.jpg', ('Imgs/img({}).jpg').format(i))

subprocess.call("cat *.jpg | ffmpeg -f image2pipe -i - output.mkv", shell=True)
time.sleep(1)
subprocess.call("rm -rf *.jpg", shell=True)
