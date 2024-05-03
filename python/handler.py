from typing import Dict, List, Any
import supervision as sv
import urllib.request
import numpy as np
import cv2
import base64
from inference_sdk import InferenceHTTPClient


class EndpointHandler:
    def __init__(self):  # pass api key to model
        pass

    def __call__(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        inputs = data.get("inputs")
        isurl = inputs.get("isurl")
        path = inputs.get("path")
        key = inputs.get("key")
        ###########################  Load Image  #################################
        CLIENT = InferenceHTTPClient(api_url="https://detect.roboflow.com", api_key=key)
        if isurl:  # for url set isurl = 1
            req = urllib.request.urlopen(path)
            arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
            img = cv2.imdecode(arr, -1)  # 'Load it as it is'
        else:  # for image file
            img = cv2.imread(path)
        ###########################################################################

        ###########################  Model Detection  #################################
        # change model_id to use a different model
        # can try:
        # clothing-segmentation-dataset/1
        # t-shirts-detector/1
        # mainmodel/2
        result = CLIENT.infer(path, model_id="mainmodel/2")
        detections = sv.Detections.from_inference(result)
        # print(detections)
        ###########################################################################

        ###########################  Data proccessing  #################################
        # only pass the first detection
        # change 1 -> to len(detections.xyxy) to pass all photos
        if detections.confidence.size == 0:
            return "Not Found"
        else:
            x1, y1, x2, y2 = (
                int(detections.xyxy[0][0]),
                int(detections.xyxy[0][1]),
                int(detections.xyxy[0][2]),
                int(detections.xyxy[0][3]),
            )
            clothes = img[y1:y2, x1:x2]
            retval, buffer = cv2.imencode(".jpg", clothes)
        # create base 64 object
        jpg_as_text = base64.b64encode(buffer).decode("utf-8") # Decode bytes to string
        ###########################################################################
        return jpg_as_text


###########################################################################


# data = {
#     "inputs": {
#         "isurl": True,
#         "path": "http://192.168.10.20/cam-hi.jpg",
#         "key": "iJuYzEzNEFSaQq4e0hfE",
#     }
# }

# #  test run
# Model = EndpointHandler()
# print(Model(data))
