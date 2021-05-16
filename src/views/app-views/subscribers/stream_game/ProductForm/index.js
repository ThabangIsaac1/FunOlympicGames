import React, { useState, useEffect } from "react";
import PageHeaderAlt from "components/layout-components/PageHeaderAlt";
import {
  Tabs,
  DatePicker,
  Row,
  Col,
  Select,
  Form,
  Input,
  Avatar,
  Comment,
  Tooltip,
  Card,
  Upload,
  Button,
  message,
} from "antd";
import Flex from "components/shared-components/Flex";
// import GeneralField from './GeneralField'
import VariationField from "./VariationField";
import ShippingField from "./ShippingField";
import { Facebook, Twitter } from 'react-sharingbuttons'
import { CommentOutlined, ShareAltOutlined } from "@ant-design/icons";
import ProductListData from "assets/data/product-list.data2.json";
import moment from "moment";
import axios from "axios";
import { auth, storage } from "../../../../../firebase";
import YouTube from "@u-wave/react-youtube";
import 'react-sharingbuttons/dist/main.css'
const { TabPane } = Tabs;
const { TextArea } = Input;
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const ADD = "ADD";
const EDIT = "EDIT";

const ProductForm = (props) => {
  const { mode = ADD, param } = props;
  const [events, setEvents] = useState({});
  const [errors, setErrors] = useState({});
  const [list, setList] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [fetchComments, setfetchComments] = useState([]);
  const [comments, setComments] = useState({
    comment: "",
  });

  useEffect(() => {
    fetch(
      "https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/eventComments"
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error("Error fetching data.");
        }
      })
      .then((fetchComments) => {
        const { id } = param;

        let filteredComments = fetchComments.filter(function (e) {
          return e.id === id;
        });

        setfetchComments(filteredComments);
      })
      .catch((error) => {
        setErrors(error);
      });

    axios
      .get(
        `https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/subscribers
    `
      )
      .then((res) => {
        console.log(res.data);
        setSubscribers(res.data);
      });

    if (mode === EDIT) {
      const { id } = param;

      axios
        .get(
          `https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/events/${id}
      `
        )
        .then((res) => {
          setEvents(res.data.virtualLink);
        })
        .then(() => {});
    }
  }, []);

  const handle = (e) => {
    setComments({ ...comments, [e.target.name]: e.target.value });
  };

  const submit = () => {
    const { id } = param;
    let email = auth.currentUser.email;
    let subcr = subscribers.filter((e) => {
      return e.email === email;
    });

    let name = subcr[0].fullName;
    let comment = comments.comment;
    axios
      .post(
        "https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/eventComments",
        { fullName: name, comment, id }
      )
      .then(() => {
        message.success("Comment Shared");
      });
  };
  const url = `https://youtu.be/${events}`
  const shareText = 'Check Out This Event!'
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

          {fetchComments.map((commented) => {
              return (
            <Comment
              author={<a>{commented.fullName}</a>}
              content={<p style={{ textAlign: "justify" }}>{commented.comment}</p>}
            ></Comment>
            )
  })}
            <Form.Item style={{ paddingTop: 30 }}>
              <TextArea
                name="comment"
                value={comments.comment}
                onChange={handle}
                rows={2}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                onClick={submit}
                icon={<CommentOutlined />}
              >
                Comment
              </Button>

                    <div     style={{ float: "right" }}>
            <Facebook url={url} />
            <Twitter url={url} shareText={shareText} />
          </div>
           
            </Form.Item>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductForm;
