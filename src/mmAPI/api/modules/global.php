<?php

class GlobalMethods {
    public function sendPayload($data, $remarks, $message, $code) {
        $status = array("remarks" => $remarks, "message" => $message);
        http_response_code($code);
        header('Content-Type: application/json');
        return json_encode(array(
            "status" => $status,
            "payload" => $data,
            "prepared_by" => "Christel Louise Ng",
            "timestamp" => date_create()->format('Y-m-d H:i:s')
        ));
    }
}
?>