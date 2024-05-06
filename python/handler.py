from typing import Dict, List, Any
import urllib.request
import numpy as np
import cv2
import base64
from ultralytics import YOLO
import os
import gdown
from PIL import Image
import io

class EndpointHandler:
    def __init__(self, path='.'):  # pass api key to model
        # current_directory = os.getcwd()
        # print("Current working directory:", current_directory)
        
        url = "https://drive.google.com/uc?id=1jB8sDYYOTfuF7B1PMcDjkm5R7huv97Wm"
        gdown.download(url, './best.pt', quiet=False)
        
        self.model = YOLO("./best.pt")
    def __call__(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        inputs = data.get("inputs")
        isurl = inputs.get("isurl")
        path = inputs.get("path")
        
        model = self.model
###########################  Load Image  #################################       
        if(isurl): # for url set isurl = 1
            print("checkpoint 2-1")
            req = urllib.request.urlopen(path)
            print("checkpoint 2-2")
            arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
            print("checkpoint 2-3")
            img = cv2.imdecode(arr, -1) # 'Load it as it is'
        else: # for image file
            img = cv2.imread(path)
            
        print("checkpoint 2")
###########################################################################       
            
        
###########################  Model Detection  #################################
        # change model_id to use a different model 
        # can try: 
        # clothing-detection-s4ioc/6 //good
        # clothing-segmentation-dataset/1
        # t-shirts-detector/1
        # mainmodel/2
        #result = self.CLIENT.infer(path, model_id="mainmodel/2")
        result = model(img)
        #annotated_frame = result[0].plot()
        detections = result[0].boxes
        #print(result[0].boxes.xyxy)
        #cv2.imshow("YOLOv8 Inference", annotated_frame)
        # print(result)
        #cv2.waitKey(0)
        #detections = sv.Detections.from_inference(result)
        # print(detections)
        
        print("checkpoint 3")
###########################################################################


###########################  Data proccessing  #################################
        # only pass the first detection
        # change 1 -> to len(detections.xyxy) to pass all photos
        if(detections.xyxy.shape[0] == 0): 
            return "Not Found"
        else:
            x1, y1, x2, y2 = int(detections.xyxy[0][0]), int(detections.xyxy[0][1]), int(detections.xyxy[0][2]), int(detections.xyxy[0][3])
            clothes = img[y1: y2, x1: x2]
            retval , buffer = cv2.imencode('.jpg', clothes)   
            cv2.imwrite("result.jpg", clothes)  
        # create base 64 object
        jpg_as_text = base64.b64encode(buffer) # Decode bytes to string")
        # base64_encoded = base64.b64encode(image_bytes).decode("utf-8")
        
        # Get the image format
        image_format = Image.open(io.BytesIO(buffer)).format.lower()
        
        # Construct the data URI
        data_uri = f"data:image/{image_format};base64,{jpg_as_text}"
        
        return data_uri
        print("checkpoint 4")
###########################################################################
        return jpg_as_text
###########################################################################    
    
    
    
#  test run  
Model = EndpointHandler()
data = {
    "inputs": {
        "isurl": True,
        "path": "http://10.10.2.100/cam-lo.jpg",
        # "path": "https://www.next.us/nxtcms/resource/blob/5791586/ee0fc6a294be647924fa5f5e7e3df8e9/hoodies-data.jpg",
        # "key": "iJuYzEzNEFSaQq4e0hfE",
    }
}
# # test file image
# print(Model(data))

#test url
print(Model(data))


