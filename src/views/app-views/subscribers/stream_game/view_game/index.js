import { React, useState, useEffect } from "react";
import {
  Comment,
  Tooltip,
  Avatar,
  Row,
  Col,
  Card,
  Form,
  Upload,
  message,
  Select,
  Button,
  Input,

} from "antd";
import { CommentOutlined, ShareAltOutlined } from '@ant-design/icons';
import moment from "moment";
import { ImageSvg } from "assets/svg/icon";
import CustomIcon from "components/util-components/CustomIcon";
import YouTube from "@u-wave/react-youtube";
import axios from 'axios'
const { Dragger } = Upload;
const { Option } = Select;
const { TextArea } = Input;


const rules = {
  name: [
    {
      required: true,
      message: "Please enter product name",
    },
  ],
  description: [
    {
      required: true,
      message: "Please enter product description",
    },
  ],
  price: [
    {
      required: true,
      message: "Please enter product price",
    },
  ],
  comparePrice: [],
  taxRate: [
    {
      required: true,
      message: "Please enter tax rate",
    },
  ],
  cost: [
    {
      required: true,
      message: "Please enter item cost",
    },
  ],
};

const imageUploadProps = {
  name: "file",
  multiple: true,
  listType: "picture-card",
  showUploadList: false,
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};



const GeneralField = (props) => {
 const { param } = props;

  const [list, setList] = useState([])
  const [data, setData] = useState([])
  const [events, setEvents] = useState({})
  useEffect(() => {
    // const { id } = param
    
        axios.get(`https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/events
        
        `).
        then((res) => {
          console.log(res.data)
          setEvents(res.data.virtualLink)
          

        })
  }, [])


  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={16} md={16}>
          <Card hoverable>
            <div className="video-responsive">
              <YouTube video={events} autoplay />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8} md={7}>
          <Card hoverable>
            <Comment
              author={<a>Han Solo</a>}
              avatar={
                <Avatar
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  alt="Han Solo"
                />
              }
              content={
                <p style={{ textAlign: "justify" }}>
                  Incredible Hurdle race, I think bolt should have started the race though.Jamaica would have won the race.
          </p>
              }
              datetime={
                <Tooltip title={moment().format("YYYY-MM-DD HH:mm:ss")}>
                  <span>{moment().fromNow()}</span>
                </Tooltip>
              }
            />
            <Form.Item style={{ paddingTop: 30 }}>
              <TextArea name="comment" value={data.comment} rows={2} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={null} icon={<CommentOutlined />}>
                Comment
    </Button>

              <Tooltip title="Share" >
                <Button shape="circle" icon={<ShareAltOutlined style={{ color: "green" }} />} style={{ float: "right" }} />
              </Tooltip>

            </Form.Item>
          </Card>
        </Col>
      </Row>
)
    </>
  )
}
export default GeneralField;
