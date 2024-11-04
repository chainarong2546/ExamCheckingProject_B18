import base64
import json
import tensorflow as tf
import numpy as np
import cv2
import psycopg2
from typing import List
from celery import Celery, signals
from models.dataClass import Answer, Square

tf.config.threading.set_intra_op_parallelism_threads(4)
tf.config.threading.set_inter_op_parallelism_threads(4)


# การเชื่อมต่อกับฐานข้อมูล PostgreSQL
DATABASE_CONFIG = {
    'dbname': 'ExamChecking_B18',
    'user': 'postgres',
    'password': '186a81af3bed7d17cc9cb631470f50ae27c996b79a27c9c47def76738d05a373ecb047e661f9c668c708740880e101705f8f81c1e7915af1e47945c586393a70',
    'host': 'localhost',
    'port': '5432'
}

celery_app = Celery(
    __name__,
    broker='redis://:0419fda8aa74d033a5b92125574916329da4a510b3fb96248589ac4cc8892337d2a9630a349d3a8905dd121a8e82851c8f5bc061a30ca8eae43601e62bb39431@localhost:6379/0',
    backend='redis://:0419fda8aa74d033a5b92125574916329da4a510b3fb96248589ac4cc8892337d2a9630a349d3a8905dd121a8e82851c8f5bc061a30ca8eae43601e62bb39431@localhost:6379/0'
)
celery_app.conf.broker_connection_retry_on_startup = True


def check_answer_all_true(a: bool, b: bool, c: bool, d: bool, a_predicted: int, b_predicted: int, c_predicted: int, d_predicted: int) -> bool:
    if a and a_predicted != 1:
        return False
    if not a and a_predicted == 1:
        return False
    if b and b_predicted != 1:
        return False
    if not b and b_predicted == 1:
        return False
    if c and c_predicted != 1:
        return False
    if not c and c_predicted == 1:
        return False
    if not d and d_predicted == 1:
        return False
    if d and d_predicted != 1:
        return False
    return True

def check_answer_all_false(a: bool, b: bool, c: bool, d: bool, a_predicted: int, b_predicted: int, c_predicted: int, d_predicted: int) -> bool:
    if a and a_predicted == 1:
        return True
    if b and b_predicted == 1:
        return True
    if c and c_predicted == 1:
        return True
    if d and d_predicted == 1:
        return True
    return False


# ฟังก์ชันเพื่ออัปเดตสถานะในฐานข้อมูล
def update_status(task_id, status):
    conn = None
    try:
        conn = psycopg2.connect(**DATABASE_CONFIG)
        cur = conn.cursor()
        
        update_query = """
        UPDATE public.sheets
        SET status = %s
        WHERE process_id = %s;
        """
        cur.execute(update_query, (status, task_id))
        
        conn.commit()
        cur.close()
    except Exception as e:
        print(f"Error updating status: {e}")
    finally:
        if conn:
            conn.close()
            
# ฟังก์ชันเพื่อบันทึกผลลัพธ์การประมวลผล
def save_result(task_id, result):
    print(result)
    conn = None
    try:
        conn = psycopg2.connect(**DATABASE_CONFIG)
        cur = conn.cursor()
    
        # แปลง dict เป็น JSON string
        predict_std_detail_json = json.dumps(result['predict_std_detail'])
        predict_std_result_json = json.dumps(result['predict_std_result'])
        predict_ans_detail_json = json.dumps(result['predict_detail'])
        predict_ans_result_json = json.dumps(result['predict_result'])
        
        update_query = """
        UPDATE public.sheets
        SET predict_std_detail = %s, 
            predict_std_result = %s, 
            predict_ans_detail = %s, 
            predict_ans_result = %s, 
            total_score = %s, 
            status = %s
        WHERE process_id = %s;
        """
        cur.execute(update_query, (
            predict_std_detail_json, 
            predict_std_result_json, 
            predict_ans_detail_json, 
            predict_ans_result_json, 
            result['total_score'], 
            'completed', 
            task_id
        ))
        conn.commit()
        cur.close()
    except Exception as e:
        print(f"Error saving result: {e}")
    finally:
        if conn:
            conn.close()


@celery_app.task(bind=True)
def process_predict_task(
    self,
    warped_img: str,  # รับเป็น string ที่ได้จากการเข้ารหัส Base64
    template_answer_json: List[List[Square]],
    template_std_id_json: List[Square],
    answer_json: List[Answer],
):

    # โหลดโมเดล
    ai_cross_model = tf.keras.models.load_model('/root/ExamChecking_B18/image-process-api/ai_model/model_ans_mix.keras')
    ai_number_model = tf.keras.models.load_model('/root/ExamChecking_B18/image-process-api/ai_model/model_number.keras')

    try:
        # แปลงกลับจาก Base64 เป็น numpy.ndarray
        img_bytes = base64.b64decode(warped_img)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        warped_img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)


        # for return
        predict_std_detail = []
        predict_std_result = []
        predict_detail = []
        predict_result = []
        total_score = 0

        
        for idx, tem in enumerate(template_std_id_json):
            tem_img = cv2.resize(warped_img[tem['sy']:tem['ey'], tem['sx']:tem['ex']], (28, 28))
            tem_img = tem_img.astype('float32') / 255.0
            tem_img = np.expand_dims(tem_img, axis=0)
            
            predictions = ai_number_model.predict(tem_img)
            predicted = np.argmax(predictions[0])
            predict_std_detail.append([float(item) for item in predictions[0]])
            predict_std_result.append(int(predicted))

        for idx, ans in enumerate(answer_json):
            a = ans['a']
            b = ans['b']
            c = ans['c']
            d = ans['d']
            all = ans['all']
            point = ans['point']
            
           
            print(f"Length of template_std_id_json: {len(template_std_id_json)}")
            print(f"Length of template_answer_json: {len(template_answer_json)}")
            print(f"Index idx: {idx}")
        
            a_box = template_answer_json[idx][0]
            b_box = template_answer_json[idx][1]
            c_box = template_answer_json[idx][2]
            d_box = template_answer_json[idx][3]
            
            a_img = cv2.resize(warped_img[a_box['sy']:a_box['ey'], a_box['sx']:a_box['ex']], (26, 26))
            b_img = cv2.resize(warped_img[b_box['sy']:b_box['ey'], b_box['sx']:b_box['ex']], (26, 26))
            c_img = cv2.resize(warped_img[c_box['sy']:c_box['ey'], c_box['sx']:c_box['ex']], (26, 26))
            d_img = cv2.resize(warped_img[d_box['sy']:d_box['ey'], d_box['sx']:d_box['ex']], (26, 26))
            
            a_img = a_img.astype('float32') / 255.0
            a_img = np.expand_dims(a_img, axis=0)
            b_img = b_img.astype('float32') / 255.0
            b_img = np.expand_dims(b_img, axis=0)
            c_img = c_img.astype('float32') / 255.0
            c_img = np.expand_dims(c_img, axis=0)
            d_img = d_img.astype('float32') / 255.0
            d_img = np.expand_dims(d_img, axis=0)

            # predict classes =>  cancle  cross  blank
            a_predictions = ai_cross_model.predict(a_img)
            b_predictions = ai_cross_model.predict(b_img)
            c_predictions = ai_cross_model.predict(c_img)
            d_predictions = ai_cross_model.predict(d_img)

            a_predicted = np.argmax(a_predictions[0])
            b_predicted = np.argmax(b_predictions[0])
            c_predicted = np.argmax(c_predictions[0])
            d_predicted = np.argmax(d_predictions[0])
            
            predict_detail.append({
                "a": [float(item) for item in a_predictions[0]],
                "b": [float(item) for item in b_predictions[0]],
                "c": [float(item) for item in c_predictions[0]],
                "d": [float(item) for item in d_predictions[0]]
            })
            
            predict_result.append({
                "a": int(a_predicted),
                "b": int(b_predicted),
                "c": int(c_predicted),
                "d": int(d_predicted)
            })
            
            if all is True :
                correct = check_answer_all_true(a, b, c, d, int(a_predicted), int(b_predicted), int(c_predicted), int(d_predicted))
            else :
                correct = check_answer_all_false(a, b, c, d, int(a_predicted), int(b_predicted), int(c_predicted), int(d_predicted))
                
            if correct :
                total_score += point

        return {
            "predict_std_detail": predict_std_detail,
            "predict_std_result": predict_std_result,
            "predict_detail": predict_detail,
            "predict_result": predict_result,
            "total_score": total_score
        }
        
    except Exception as e:

        raise e


# Signal ก่อนที่จะเริ่มกระบวนการ
@signals.task_prerun.connect
def task_started_handler(sender=None, task_id=None, task=None, **kwargs):
    update_status(task_id, 'processing')


# Signal หลังจากกระบวนการเสร็จสิ้น
@signals.task_postrun.connect
def task_completed_handler(sender=None, task_id=None, task=None, **kwargs):
    if kwargs['retval'] :
        save_result(task_id, kwargs['retval'])
    else:
        update_status(task_id, 'failed')