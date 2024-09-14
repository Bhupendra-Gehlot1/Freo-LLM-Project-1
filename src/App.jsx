import React, { useState,useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { chatSession } from './service/AiModal';

const tables = [
  {
    id: 1,
    name: "Table 1",
    data: [
      { fieldName: "id", columnName: "id", dataType: "VARCHAR", length: 36, partition: "Partition", remarks: "Customer ID for logged in users. Guest ID (is_guest = true) for guest users (i.e. not user without login)" },
      { fieldName: "email", columnName: "email", dataType: "VARCHAR", length: 256, partition: "no", remarks: "User email id" },
      { fieldName: "phone", columnName: "phone", dataType: "NUMERIC", length: 16, partition: "no", remarks: "User phone" },
      { fieldName: "isGuest", columnName: "is_guest", dataType: "BOOLEAN", length: "NA", partition: "Partition", remarks: "To differenciate guest user with logged in user" },
      { fieldName: "createdAt", columnName: "created_at", dataType: "TIMESTSAMP", length: "NA", partition: "no", remarks: "Record created timestamp" },
      { fieldName: "modifiedAt", columnName: "modified_at", dataType: "TIMESTSAMP", length: "NA", partition: "no", remarks: "Record modified timestamp" },
    ]
  },
  {
    id: 2,
    name: "Table 2",
    data: [
      { fieldName: "customerId", columnName: "customer_id", dataType: "VARCHAR", length: 36, partition: "Partition", remarks: "Customer ID" },
      { fieldName: "key", columnName: "key", dataType: "VARCHAR", length: 256, partition: "Partition", remarks: "Attribute Key" },
      { fieldName: "attributeType", columnName: "attr_type", dataType: "CHAR", length: 16, partition: "no", remarks: "Attribute Type. enum: SYS, USR (More will be added later)" },
      { fieldName: "attributeDataType", columnName: "attr_data_type", dataType: "VARCHAR", length: 256, partition: "no", remarks: "Attribute data type. enum: 'STR' for STRING, 'BOL' for BOOLEAN, 'INT' for INTEGER, 'FLT' for FLOAT, 'TSM' for TIMESTAMP" },
      { fieldName: "valueStr", columnName: "value_string", dataType: "VARCHAR", length: 512, partition: "no", remarks: "Holds string value for all the data type for the given key" },
      { fieldName: "valueInt", columnName: "value_integer", dataType: "LONG", length: "NA", partition: "no", remarks: "Holds int / long value for 'INT' data type for the given key" },
      { fieldName: "valueFloat", columnName: "value_float", dataType: "DOUBLE", length: "NA", partition: "no", remarks: "Holds float / double value for 'FLOAT' data type for the given key" },
      { fieldName: "valueTimestamp", columnName: "value_timestamp", dataType: "TIMESTSAMP", length: "NA", partition: "no", remarks: "Holds timestamp value for 'TSM' data type for the given key" },
      { fieldName: "valueBoolean", columnName: "value_boolean", dataType: "BOOL", length: "NA", partition: "no", remarks: "Holds boolean value for 'BOL' data type for the given key" },
      { fieldName: "appInstanceId", columnName: "app_instance_id", dataType: "UUID", length: "NA", partition: "no", remarks: "Application instance id. will be unique for every application client instance" },
      { fieldName: "customerInstanceId", columnName: "customer_instance_id", dataType: "UUID", length: "NA", partition: "no", remarks: "Customer instance id. will be unique for every customer and client instance" },
      { fieldName: "sessionId", columnName: "session_id", dataType: "UUID", length: "NA", partition: "no", remarks: "Customer session" },
      { fieldName: "deviceId", columnName: "device_id", dataType: "VARCHAR", length: 32, partition: "no", remarks: "Device Unique Id" },
      { fieldName: "advertisingId", columnName: "advertising_id", dataType: "VARCHAR", length: 64, partition: "no", remarks: "Device Advertising Id" },
      { fieldName: "guest_id", columnName: "guest_id", dataType: "VARCHAR", length: 36, partition: "no", remarks: "After merging the event with the customer_id (after login), this will hold the actual guest id" },
      { fieldName: "occurredAt", columnName: "occurred_at", dataType: "TIMESTSAMP", length: "NA", partition: "no", remarks: "Attribute change occurred time stamp" },
      { fieldName: "createdAt", columnName: "created_at", dataType: "TIMESTSAMP", length: "NA", partition: "no", remarks: "Record created timestamp" },
      { fieldName: "modifiedAt", columnName: "modified_at", dataType: "TIMESTSAMP", length: "NA", partition: "no", remarks: "Record modified timestamp" },
    ]
  },
  {
    id: 3,
    name: "Table 3",
    data: [
      { fieldName: "id", columnName: "id", dataType: "UUID", length: 25, partition: "Partition", remarks: "Event ID (PK)" },
      { fieldName: "eventType", columnName: "event_type", dataType: "VARCHAR", length: 64, partition: "no", remarks: "Event Type. enum: SYS, USR (More will be added later)" },
      { fieldName: "eventName", columnName: "event_name", dataType: "VARCHAR", length: 256, partition: "Partition", remarks: "Event name" },
      { fieldName: "customerId", columnName: "customer_id", dataType: "CHAR", length: 25, partition: "Partition", remarks: "Customer ID (it may have Guest ID also)" },
      { fieldName: "source", columnName: "source", dataType: "VARCHAR", length: 256, partition: "no", remarks: "Event source" },
      { fieldName: "platform", columnName: "platform", dataType: "VARCHAR", length: 256, partition: "no", remarks: "Client platform: iOS,Android,Web,Server" },
      { fieldName: "appVersion", columnName: "app_version", dataType: "CHAR", length: 16, partition: "no", remarks: "Client Application Version" },
      { fieldName: "sdkVersion", columnName: "sdk_version", dataType: "CHAR", length: 16, partition: "no", remarks: "Evently SDK Version" },
      { fieldName: "productId", columnName: "product_id", dataType: "VARCHAR", length: 256, partition: "no", remarks: "Product : MONEYTAP, FREOPAY, FREOSAVE, ONEAPP, UPI" },
      { fieldName: "occurredAt", columnName: "occurred_at", dataType: "TIMESTSAMP", length: "NA", partition: "Partition", remarks: "Event occurred timestamp" },
      { fieldName: "expiresAt", columnName: "expires_at", dataType: "TIMESTSAMP", length: "NA", partition: "no", remarks: "Eventy expiry timestamp" },
      { fieldName: "appInstanceId", columnName: "app_instance_id", dataType: "UUID", length: "NA", partition: "no", remarks: "Application instance id. will be unique for every application client instance" },
      { fieldName: "customerInstanceId", columnName: "customer_instance_id", dataType: "UUID", length: "NA", partition: "no", remarks: "Customer instance id. will be unique for every customer and client instance" },
      { fieldName: "sessionId", columnName: "session_id", dataType: "UUID", length: "NA", partition: "no", remarks: "Customer session" },
      { fieldName: "deviceId", columnName: "device_id", dataType: "VARCHAR", length: 36, partition: "no", remarks: "Device Unique Id" },
      { fieldName: "advertisingId", columnName: "advertising_id", dataType: "VARCHAR", length: 64, partition: "no", remarks: "Device Advertising Id" },
      { fieldName: "eventDuration", columnName: "event_duration", dataType: "INT", length: "NA", partition: "no", remarks: "Event duration in milli seconds" },
      { fieldName: "guest_id", columnName: "guest_id", dataType: "VARCHAR", length: 36, partition: "no", remarks: "After merging the event with the customer_id (after login), this will hold the actual guest id" },
      { fieldName: "createdAt", columnName: "created_at", dataType: "TIMESTSAMP", length: "NA", partition: "no", remarks: "Record created timestamp" },
    ]
  },
  {
    id: 4,
    name: "Table 4",
    data: [
      { fieldName: "id", columnName: "id", dataType: "CHAR", length: 25, partition: "no", remarks: "Event attribute id (PK)" },
      { fieldName: "eventId", columnName: "event_id", dataType: "CHAR", length: 25, partition: "Partition", remarks: "Event ID (FK referencing id column of event)" },
      { fieldName: "key", columnName: "key", dataType: "VARCHAR", length: 256, partition: "Partition", remarks: "Attribute key" },
      { fieldName: "attributeType", columnName: "attr_type", dataType: "CHAR", length: 3, partition: "no", remarks: "Attribute Type. enum: SYS, USR (More will be added later)" },
      { fieldName: "attributeDataType", columnName: "attr_data_type", dataType: "VARCHAR", length: 256, partition: "no", remarks: "Attribute data type. enum: 'STR' for STRING, 'BOL' for BOOLEAN, 'INT' for INTEGER, 'FLT' for FLOAT, 'TSM' for TIMESTAMP" },
      { fieldName: "valueStr", columnName: "value_string", dataType: "VARCHAR", length: 512, partition: "no", remarks: "Holds string value for all the data type for the given key" },
      { fieldName: "valueInt", columnName: "value_integer", dataType: "LONG", length: "NA", partition: "no", remarks: "Holds int / long value for 'INT' data type for the given key" },
      { fieldName: "valueFloat", columnName: "value_float", dataType: "DOUBLE", length: "NA", partition: "no", remarks: "Holds float / double value for 'FLOAT' data type for the given key" },
      { fieldName: "valueTimestamp", columnName: "value_timestamp", dataType: "TIMESTSAMP", length: "NA", partition: "no", remarks: "Holds timestamp value for 'TSM' data type for the given key" },
      { fieldName: "valueBoolean", columnName: "value_boolean", dataType: "BOOL", length: "NA", partition: "no", remarks: "Holds boolean value for 'BOL' data type for the given key" },
    ]
  }
];

const App = () => {
  const [selectedTables, setSelectedTables] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [finalSelectedValue, setFinalSelectedValue] = useState('');
  const AI_Prompt = "{table_data} \n\nnow based on the given table(s) i need to answer the following question and generate the SQL query for the same question also do not give me anything other than SQL query i just want error free clean SQL query and make sure it should be very accurate considering whatever the question i'm giving make it as simple as possible and also very accurate and clean considering handling database request and don't generate anything else than query \n\nquestion is: {event_data}"

  useEffect(() => {
    const selectedTablesData = tables.filter(table => selectedTables.includes(table.id));
    setFinalSelectedValue(JSON.stringify(selectedTablesData, null, 2));
  }, [selectedTables]);

  const handleTableSelect = (tableId) => {
    setSelectedTables(prevSelected => {
      if (prevSelected.includes(tableId)) {
        return prevSelected.filter(id => id !== tableId);
      } else {
        return [...prevSelected, tableId];
      }
    });
  };

  const handleGenerate = async () => {
    const FINAL_Prompt = AI_Prompt.replace("{table_data}", finalSelectedValue).replace("{event_data}", inputValue);
    console.log(FINAL_Prompt);
    const result = await chatSession.sendMessage(FINAL_Prompt);
    setOutputValue(result.response.text());
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Table</h1>

      <div className="mb-4">
        {tables.map((table) => (
          <div key={table.id} className="flex items-center space-x-2 mb-2">
            <Checkbox
              id={`table-${table.id}`}
              checked={selectedTables.includes(table.id)}
              onCheckedChange={() => handleTableSelect(table.id)}
            />
            <Label htmlFor={`table-${table.id}`}>{table.name}</Label>
          </div>
        ))}
      </div>

      {selectedTables.length > 0 && (
        <div className="mb-4 overflow-x-auto">
          {selectedTables.map(tableId => {
            const table = tables.find(t => t.id === tableId);
            return (
              <div key={table.id} className="mb-8">
                <h2 className="text-xl font-semibold mb-2">{table.name}</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field Name</TableHead>
                      <TableHead>Column Name</TableHead>
                      <TableHead>Data Type</TableHead>
                      <TableHead>Length</TableHead>
                      <TableHead>Partition</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {table.data.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.fieldName}</TableCell>
                        <TableCell>{row.columnName}</TableCell>
                        <TableCell>{row.dataType}</TableCell>
                        <TableCell>{row.length}</TableCell>
                        <TableCell>{row.partition}</TableCell>
                        <TableCell>{row.remarks}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            );
          })}
        </div>
      )}

      <div className="mb-4">
        <Label htmlFor="input">Input</Label>
        <Input
          id="input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter your input here"
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="output">Output</Label>
        <textarea
          id="output"
          value={outputValue}
          onChange={(e) => setOutputValue(e.target.value)}
          className="w-full h-64 p-2 border rounded"
          style={{backgroundColor:'#1c1d1f'}}          
          placeholder="Output will appear here"
        />
      </div>
      <Button onClick={handleGenerate} className='border'>Generate</Button>
    </div>
  );
};

export default App;