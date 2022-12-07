/*
  Modified from MAX30105 Breakout Example
  By: Ashton Rowe
  With help from: Nathan Seidle @ SparkFun Electronics
*/

#include <Wire.h>
#include <MAX30105.h>
#include "spo2_algorithm.h"

MAX30105 particleSensor;

#define MAX_BRIGHTNESS 255
#define WAIT_TIME 1800000 // time inbetween measurements in milliseconds (default of 30 mins = 1800000 ms)
#define TEST_TIME 300000 // time to take test before stopping and waiting (default of 5 mins = 300000 ms)

uint32_t irBuffer[100]; //infrared LED sensor data
uint32_t redBuffer[100];  //red LED sensor data

int32_t bufferLength; //data length
int32_t spo2; //SPO2 value
int8_t validSPO2; //indicator to show if the SPO2 calculation is valid
int32_t heartRate; //heart rate value
int8_t validHeartRate; //indicator to show if the heart rate calculation is valid

boolean dataSent = false;

unsigned long test_start; // time when program started

byte blueLED = 2;
byte greenLED = 3;

void setup() {
  Serial.begin(115200); // initialize serial communication at 115200 bits per second:

  pinMode(blueLED, OUTPUT);
  pinMode(greenLED, OUTPUT);

  // Initialize sensor
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) //Use default I2C port, 400kHz speed
  {
    Serial.println(F("MAX30105 was not found. Please check wiring/power."));
    while (1);
  }

  byte ledBrightness = 60; //Options: 0=Off to 255=50mA
  byte sampleAverage = 4; //Options: 1, 2, 4, 8, 16, 32
  byte ledMode = 2; //Options: 1 = Red only, 2 = Red + IR, 3 = Red + IR + Green
  byte sampleRate = 100; //Options: 50, 100, 200, 400, 800, 1000, 1600, 3200
  int pulseWidth = 411; //Options: 69, 118, 215, 411
  int adcRange = 4096; //Options: 2048, 4096, 8192, 16384

  particleSensor.setup(ledBrightness, sampleAverage, ledMode, sampleRate, pulseWidth, adcRange); //Configure sensor with these settings
}

void loop() {
  dataSent = false;
  test_start = millis(); // record time at beginning of test
  digitalWrite(blueLED, HIGH);

  bufferLength = 100; //buffer length of 100 stores 4 seconds of samples running at 25sps

  //read the first 100 samples, and determine the signal range
  for (byte i = 0 ; i < bufferLength ; i++)
  {
    while (particleSensor.available() == false) //do we have new data?
      particleSensor.check(); //Check the sensor for new data

    redBuffer[i] = particleSensor.getRed();
    irBuffer[i] = particleSensor.getIR();
    particleSensor.nextSample(); //We're finished with this sample so move to next sample
  }

  //calculate heart rate and SpO2 after first 100 samples (first 4 seconds of samples)
  maxim_heart_rate_and_oxygen_saturation(irBuffer, bufferLength, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);

  //Take samples while not in timeout
  while (!dataSent)
  {
    //dumping the first 25 sets of samples in the memory and shift the last 75 sets of samples to the top
    for (byte i = 25; i < 100; i++)
    {
      redBuffer[i - 25] = redBuffer[i];
      irBuffer[i - 25] = irBuffer[i];
    }

    //take 25 sets of samples before calculating the heart rate.
    for (byte i = 75; i < 100; i++)
    {
      while (particleSensor.available() == false) //do we have new data?
        particleSensor.check(); //Check the sensor for new data

      redBuffer[i] = particleSensor.getRed();
      irBuffer[i] = particleSensor.getIR();
      particleSensor.nextSample(); //We're finished with this sample so move to next sample
    }

    //After gathering 25 new samples recalculate HR and SP02
    maxim_heart_rate_and_oxygen_saturation(irBuffer, bufferLength, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);

    // see if timeout has occured
    if ((millis() - test_start) > TEST_TIME) {
      dataSent = true; // exit testing loop due to timeout
      digitalWrite(blueLED, LOW);
    }
    
    // check if data is valid before publishing
    if ((heartRate != -999) && (spo2 != -999)) {
      //Publish events through particle device cloud
      String dataStr;
      dataStr = String::format("{\"heartRate\": %d, \"spo2\": %d}", heartRate, spo2);
      Particle.publish("data", dataStr, PRIVATE);
      Serial.println(dataStr);
      
      dataSent = true; // exit testing loop and wait for next test time

      digitalWrite(blueLED, LOW);
      digitalWrite(greenLED, HIGH);
      delay(1000);
      digitalWrite(greenLED, LOW);
    }
  }

  delay(WAIT_TIME); // wait predetermined amount of time before testing again
}