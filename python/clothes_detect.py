import supervision as sv
import urllib.request
import numpy as np
import cv2
import base64
from inference_sdk import InferenceHTTPClient

class Image_detect:
    def __init__(self, key): #pass api key to model
        self.CLIENT = InferenceHTTPClient(
            api_url="https://detect.roboflow.com",
            api_key=key
        )
        
    def __call__(self, path , isurl):    
###########################  Load Image  #################################       
        if(isurl): # for url set isurl = 1
            req = urllib.request.urlopen(path)
            arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
            img = cv2.imdecode(arr, -1) # 'Load it as it is'
        else: # for image file
            img = cv2.imread(path)
###########################################################################       
            
        
###########################  Model Detection  #################################
        # change model_id to use a different model 
        # can try: 
        # clothing-segmentation-dataset/1
        # t-shirts-detector/1
        # mainmodel/2
        result = self.CLIENT.infer(path, model_id="mainmodel/2")
        detections = sv.Detections.from_inference(result)
        # print(detections)
###########################################################################


###########################  Data proccessing  #################################
        # only pass the first detection
        # change 1 -> to len(detections.xyxy) to pass all photos
        if(detections.confidence.size == 0): 
            return "Not Found"
        else:
            x1, y1, x2, y2 = int(detections.xyxy[0][0]), int(detections.xyxy[0][1]), int(detections.xyxy[0][2]), int(detections.xyxy[0][3])
            clothes = img[y1: y2, x1: x2]
            retval , buffer = cv2.imencode('.jpg', clothes)     
        # create base 64 object
        jpg_as_text = base64.b64encode(buffer)
###########################################################################
        return jpg_as_text
###########################################################################    
    
    
    
#  test run  
# Model = Image_detect("api key")
# print(Model("test_images/test5.jpg", 0))