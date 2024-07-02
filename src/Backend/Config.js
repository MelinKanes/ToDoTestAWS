import AWS from 'aws-sdk';

export default function configureAWS() {
  AWS.config.update({
    region: 'eu-north-1',
    credentials: {
      accessKeyId: "AKIA2UC3FHGRHHPS4C4H",
      secretAccessKey: "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",
    },
  });
}
