import AWS from 'aws-sdk';

export default function configureAWS() {
  AWS.config.update({
    region: "",
    credentials: {
      accessKeyId: "",
      secretAccessKey: "",
    },
  });
}
