import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      imageUrl,
      sceneDescription,
      shotSize = [900, 550],
      numResults = 1,
    } = data;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image URL provided" },
        { status: 400 }
      );
    }

    if (!sceneDescription) {
      return NextResponse.json(
        { error: "No scene description provided" },
        { status: 400 }
      );
    }

    const apiToken = process.env.BRIA_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json(
        { error: "API token not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://engine.prod.bria-api.com/v1/product/lifestyle_shot_by_text",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          api_token: apiToken,
        },
        body: JSON.stringify({
          image_url: imageUrl,
          scene_description: sceneDescription,
          placement_type: "automatic",
          shot_size: shotSize,
          num_results: numResults,
          optimize_description: true,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API request failed: ${errorText}` },
        { status: response.status }
      );
    }

    const result = await response.json();

    // Transform the result to a more usable format
    const images = result.result.map((item: any) => ({
      url: item[0],
      id: item[1],
      filename: item[2],
    }));

    // const images = [
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758587.PNG?Expires=1743275694&Signature=Fe-fM62HGQY9IVfyhv8LKCUPkOBDqmb6Y8NsRfQ1CKLKT-Yz9ZgkgROYh-o7wWtfxp0PmhTTccAaaT7HZwm1jQ0X~5tnlR4trZosDl1UxFBUDjbmej0vv4zZF~hXFhfS1F7ychY1Izdlv-J4rDbKwtWboDcU-4r-A2QIKG0vrCZXjMbPZunpQjnTlE2QWBH7mxm9rMDh5uPbREmXpb6M8Njll1UbJ8bVn5YfsbdgUYzyWQKnY4UFonzr3ufGbdVgTbeWGpqz9Sp7xL-FAA17uREft70A5btViaNX-zGXSVrlNKMY9svNJnkBdMxLdCOgz0t1HW~gAdW13-jpdRswOg__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758587,
    //     filename: "efee5ebe-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758588.PNG?Expires=1743275694&Signature=Dp6PRT0iguNrKh~Ac-DgPJbvbq~cPJXHp482xaruPwc9ua8y9~T9oZfW3MFi7VWC1qgRbyI~lDkr5F7MPOD7C0RJJ0MS4fsfMcfq9-1us6cMD0V7DnENTkavK4L8Gn4Ma2fUuafVb7TkwdkePYV6pyeC0EVLHsejCNgk8H-40bOJa6kC568Tp-CXsKhuoQ4CAxQy0w9T6JoY154DTSiyhtGSqNRrLU~LSeW~-MtiI0E1fPJCtej9TdsGPv5~Z9IT2gC0Ocs3wP6DMA5SDBnbeeWPjhchb1nt5sUG9A806UU6XXnKPw344Wi1Mkqg84cOn4GBfRLCYMSXAXEa4bawuA__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758588,
    //     filename: "f0043310-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758589.PNG?Expires=1743275695&Signature=jPMzi0~YI~tNpmvmk8itH7ojo1eOxjX1dnHhHJ-eDNbeLTi3VWZVZbagCEpZMC125zqhbVTZ0kTLU4FnrsjfYDOnSLwjOUnj2wGfvIsFc30zB3OTGYx7N8OIXatSjyi8wyhLqafKLItG5tq1BjEEwLzmMSkHND8gPGT6Vdn0YTrrpVh~tjKaoraYxomppkJIDdhDkappcjuYREdwGH4GX-hfi6hjlDiD2FiMQW-06tpOoMpdwsER5ZFtp-~RLNXBakHIifLwDj799GWG60IRq3JeKzWqQDkc-5jAzvXq92tFMRIJGDph-e0p5bEJK1zWQvVbq-elpLDUlJSxOGuiRA__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758589,
    //     filename: "f019cd24-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758590.PNG?Expires=1743275695&Signature=DHFcAsIYmqFiSyEgWGcRWgp1b0e2p09h-qvFIrH-IVQabrtCdnIRhwGWqbJTEczIIcQGCF5v0WJ4760~9ooFuGY4ipHlhkYzJvLwmgqipr5mXX0iJKH3HzEHRrvhbT8fhAPHJ-nIeMLgjQaShI0mFxGH9uCZfmYh7lm~VMceaVeVP8v-lYKzRrBt7ak6OJgvy2pC2Ih1ewX4V3H0qLS1ThDa7hOpA5onipK8Q4n3~io47CeGnc-Ca3KLXdVE6-fXvFzkfUxYS69beXOAgp2EtfBqFTNFMWJ4W96vs4A1U7Fse21LL9Jh1BAdXPNoGewQ7gP2rvxzXb9bnd53nD7m5w__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758590,
    //     filename: "f03097f2-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758591.PNG?Expires=1743275695&Signature=I3fgqX4e2IKoDjmlY3xMWuza6ioPdcSIAsrJqO0Llp4mnHUixTLsSNnwN9FV6CdY0vCuWF~vGC21mnsnl37FrerLRR-kY0AAD4c4CGeeVwqMS3IC-~4PBHW9rqr5tYQ7U7vx0X2akdOTl-Rxwyb3gMeiLV2-t54IlyP7gNSxWhP9q71acX4vaT4f7j1gRLcKIndT2PxB~f5KJjvYy878UL3w9NRynJffzaLxgDADAVjjbJgMiffdSGddcpqqnaMfrP9dKn-MIQbaU-~pm7w359Qpspweu5NyauQJE5Zy2eME4dy6YHcT4o6EA1Z~WZmNtoQ7fzrD7f7NjDRqJ8Gl5w__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758591,
    //     filename: "f047ae24-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758592.PNG?Expires=1743275695&Signature=Ftz46-7aXeTzHwWpOOXeNwof2cxWjhHTFJHT5ZzPFHp3kjbhtx4KO3PaRFk5M3Pyk2lQCjhx7My6dZo-tKYEyx8HO-Yf79qfpQOKDnTOPsWLPQDtoQ~afBu~vLLICaI2g2WHQ47V3H7Um7jCEZRH4iRZVJZg6-ylmHDZ9X4x8DHyI8pJ4WmBLDuQV8a4JrJhCsBotSIy0jTCutSoXwMCIL~MD8mx5xI64YXj5ltHRWREh8tuIZr45zJRLa7QSY4jk5O4IRx8EvjgrfvgpM1K6snkT4bK~VIUyxhj0oxvNtLrAG1B~MbcBvnHGdgUQfACQ29Kllicq7qOQ4S7x0nlpQ__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758592,
    //     filename: "f05d6b1a-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758593.PNG?Expires=1743275695&Signature=j~gg4oPxXLRaqXzceItJmScE4nWhO8PqJURqxA-5PFM4wMamPhAmWgyU1a~n3oTqDPeVACGIdUNMgDZzbdsITMX6fc14Aau-KDp1uEEtssIjDFWP1yBm-6O73lUDu~aMW0pqHjR5h9MvI0xwGwtlppDCHEpQL8iMCMWw2T94JmmD5Mparc8TCZCMYob~jo-PpRMt-fkT3oKNeRMb8ZmiIFbgD2hyFh7oeteWYFhWBceuXVnfi6-7ySlJ3hzf7BhVKivZS8w3KG6G3CwWbQQ8XUAT6wGu3XJcRN4EJb1GIkzsnYSgmlx6oOK0uPfYhQ4G-fBZcrvXhX0oyMlRd9NQMg__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758593,
    //     filename: "f0755874-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758594.PNG?Expires=1743275695&Signature=a2xfXJecvTyl2dtUFZk1OsdoYmKYIhrED3dVYNqZUYV0iyCDWBh7oQfwZGgVioaxl0SfYtGlWdHht8z8vPDoHkY~ozuKejGg6XHAUrohfOkVnrhlOqNfj5cV4xIqNd7Y~zpPKVSV87o31EkjSu7lzcxoRJnaaiye76Uwaacohoe1GH5olNyFSo8zKKzVBHMaF~g6~u2O-bunlrf~pBDd-FQOeV7UVE805B2GtPXQ37Pktbt-szT4aphSoP~58ERHs5IQ5NXkbH9niSJQp-U3ZmfJgt3OxWvnq6jnoxlGAohMgogh0X67AYp9YZZY7oMLFcgnF-pKRSl4Eh4ieRJUtg__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758594,
    //     filename: "f08b92e2-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758595.PNG?Expires=1743275695&Signature=F4ZKCiqBizMrm8vBrXDPT0i3xAz63IX5cDsM5s0h5j0~wsfOLdHtau78tYOyPUgYmpaSCv1k46QZE9rPsfpcroYeCznIGszOm7lZ3p2dhsGBtNgQsYcd2D5RBA2-mGOcDIj9IWudrxk9LGbCkGOMXglDrkHTrayjSy4uX6rzV31v3NBO1bVfnUiROZdU1LjKJFQF3pV6qPgXgHSmrFti5OEc6J8V8il55u8mtIqN0JL7s3GHZMb2mruts6jTgkjmPANiACSBfea4hFCD-NSjjZuwjmHS6PTM14GfRsaZrfooPzhO0BxvnhnJimmO7Dnb-4ACSpuq4LB3cU2Dcejhag__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758595,
    //     filename: "f0a18d0e-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758596.PNG?Expires=1743275696&Signature=XxmGJ2sVAGtGaLptlG~QKbnak2B-Y0yNaYt-VdePK3aZEzWMo9gJoucZiQwhkLtvoSJhCDpg1kMlIBo62Om6fPhCdZYKDYnZ6BIAUTth57JA5h~SSslqr94c3gy5fn38aXblO8WBzDu26UEVhdyiem7ddMPBp~sgXSKTyauMul3rMrwSBfu--NJtrtM8-0kI80j43LSkl0ub7h0IC2uSmbjJzG9WTTO9Cdl8vDSlT9SN0zwdi5C18ipOFBOcKYtvUiYMJ9A8URMjb4yz9qa7Pe1SnGEAdN-gLAzEaHGliwM9PD7iNB~dEc6ky4f4VegTbjihvAlIXNUFGdDYUWK3TA__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758596,
    //     filename: "f0b76ad4-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758597.PNG?Expires=1743275696&Signature=nk5iiVpttxYCf~-6GweIymzzGqnYTU3KRyy6e~O-di9APCFuvGG4LqBupU-VI5Is2npyNrt~rJcVYPj~TNXjl1CJToVlEfHAXa9WAKr6HaexXeVbKyhaBZeOJhaSmu7~aBKAbmuznVIZ4H2XZUIOCUN1MxxGoQWBm6z1VUzU9br~HlW1cYyfhjM1Wr4N8b8Qr3YtkZ6Y-1Yn10MYlaayvTqoPFySr0NwTAa57pT7STphBHIctnk15PZN4J19GTvJNlG3wwI9YDLB84n1ek1ATHOHnO5D2~cXUh~gBYhX5M18dxx-V4lQGdFokK5WhWPneLnMFYBtueALqrxiXg39cw__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758597,
    //     filename: "f0cd3ea4-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758598.PNG?Expires=1743275696&Signature=T~tJkRnP434PIHzgksARJx6vtx6TgtgfDmTSD43LtjY8A8tJMv9sI7-iI9bw1H0aqG9B5BOBJ0kWBRuLCcO0B93NaQY7imZYXsdowyxNcqufz3U0CzJPxgjFo~rZ-yfvweFsb2KEagWGz2LClYkvVCTeZ5s9CnX0svH9SBXIWvxYP1HmMlwxFzUCgVTF91I~RMCEHm19rF0-SFqVWomgQA6jEtpD955mGabUAG-aPmD625MffnOKeiYcwUgHYB50pIwsqDtFxpE6fEAOae3RpnI4ISWFZIUM~T3SfnWHLJUjPxF-29V9E8W54t~b4r5XWaRT75yfn-7YiF3s6EoqMw__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758598,
    //     filename: "f0e27f94-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758599.PNG?Expires=1743275696&Signature=oQnBfTURQk~i-3AtPq8-JOC7f~ZNovVGmAD88Gv-oAk-OBQWQlW1IEiPn-mHD5rn5q07oljpuRpvlEAX9ov1Sz1H4y1K9uPFI2WfNpEJPqJnWyqwndL0M7f~p33X5alBAnVV8I6kQ7bd~Z6wjqiynjAV1ibEJ5tmd1Ff8He8I-2qGE357HM2hU6CRn39saS8~aXq-E87JFkZotp1r8Yy7fz4-pZE6lixkzG5-hD48HlDLtXLot6ElvvuF5FeuuZ8Zu2JrqESabo6eq9tZpaaal60Z-MwjaX6mtB6z-apZSZ9Yas~cB7IQcmJ1NeVZtey8wt8uegae6XNHFw-6-H08Q__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758599,
    //     filename: "f0fd2588-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758600.PNG?Expires=1743275696&Signature=T5Lj3PmJRofMNR6VleuIz4Gh5jedY9g3DV35QoSwadTeeBlOhVZZi9e6plBky7vVY77qbpFkNUYzNDQagFbfL6P8cXEuOM38KjcJnFq0IeQpi21As4-b-vfrOTVPKd4rDh0HaCvv1Zr3EL1zEZ~oiWs43IpKuMuSHUA1TgAY20WYuVmP2jQGwfOqvJe4LD0anmMoJqon5DbFPRzckNOTwqGcDe0CtNoHXbqI4S3RUwsTMKNIZ9sAiGtHarD5dl~NZgWPDPAjtwn-bUF3cAzV5zJDGIodsFkNcbfoHF~ATUAnsfLqMJhqOOpFv6oRkfSpwxVi0F5qYTlIgO5cj7IZUQ__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758600,
    //     filename: "f1130b5a-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758601.PNG?Expires=1743275696&Signature=kuwi~3yPY6G6UroDvC6KtDQTXT~49SCth0UepqIh8w5vwAOwWB60zn60gL1PdAv2A0mEtBVayT33SUFHAxrdu91fdJ~lnx4ruVyaPjKAqtCpnNNDS9xIwfGoE9OHaXpMvLNVwv7zIcPX0AogUVa6uFmO3TxTBlHtoDQhl8a8XzsypiYVyI27whcJQ982CQDmAs1SpjS4z0c8avh7OQjf2EzNi7C2C~MGjw3NdJ-mCjI~hnPWUt97lP-jycgWjQY-0zRhmbYL43D4eCeftrrVYGiJxiQW5TUFRgIwCcnpkwM9uNNCll7hoKUD6iCIPubVmBDKvb6tZoLMgAjSf5Q~og__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758601,
    //     filename: "f128014a-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758602.PNG?Expires=1743275696&Signature=XmX57ShZf6P6Aa337YjHTxL4XlF4yw1jN3i7205-ZzkCyYo9Of~KlLHt0kxhYr5cZKaTvw2WLUjIZQsPbYUrwSKV6T~VNpqNURyU~sbsRoHx9K~xBSNsLckOYE2zl-sFFxaNEmLvfO0C2Qa2mIgL31NdtD18aUAXqBtIiljlmJlZHCGADc3opOb1yMAhumPDhmi3ZwAym6e27avO9HtF-0BYWo-EttRrMUqXCoJifweG4Z6EqNeQS0lMKaeL55lhel~n-gUultB1j4H5cbdP3inzF~QazSFV3SbglGnqmZ3dHWlnSfpjVrP-oCXCgbX0LdnwsONt7WeFL1c2Wb8BYw__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758602,
    //     filename: "f13df5ea-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758603.PNG?Expires=1743275697&Signature=gbgqbsGR0rVEP80c5JLTypcdpvwI6lwE0WP9YMfanwd33WuhM69x6Wz6w6mWK61Pe4jgdEXlAGFzdNdqGd4rTlYe1gf3IXEd~DXAuMSXqAWstFUnb5vb1ryTXm5rkS~YMfeVwDraKNulQtqkKR3gTlCFMnvew46fvmFgnPqutkOvl2YL4cbf2JEfGqdc24mTY7bDHFKDeSqWAVTDjyJYwc4MJWRktZuj8xQ6WRr9ZQ9HhaFDxVMXxd881P~OAn7Cs7GYOcbMgwPHvqepvy2QEPe5IUprzPOA~jaDdzV8pXpVJ0Ufqty5FWMDst~ZjfX1Yn7-0lQ~9NhcS1Xc36B~Aw__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758603,
    //     filename: "f153c1ea-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758604.PNG?Expires=1743275697&Signature=EMbvRs6hXO4YmKm28vC34CVudrbTYxMXhtXH03-4VmAk4ZBR9gmd4wVBpdvCRFaIcIzWqmkkIUvtCXHbxW3eCfEbZiN2s2mZN4CGP8oJzDUMgNSdAWs6WPtpGZhidmBl36Dl4oeNN0ITZK0BbjGsZcz6OBljhfOA~6SHhFvzhDrvDIi8RcuJuRUgBGMT0Qe0LgDT7~qcPVjsokOAAEivhLC5ivMDQkNNaJ9NAE~YKEepNeCVUudpXC3ZNgZ7qokcISpoDYov0~xOeqLyoeDHVDtMXjWPGp-1kvjPAEIgYa4LyrXwb8LBRhABbuIe~Qh02EUUpLprZNVFrXZLNT0jug__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758604,
    //     filename: "f16b198a-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758605.PNG?Expires=1743275697&Signature=o5EQ4cOMGOuJmkV5m3HAyd2QZv9aZPvj1MRQS7r3shxSi5Y90G-s03rI9Xt9P9B8Gnz5D-B2mHit7b-WcJQ6rVgbakWP5YNIVm5eN6L1vgltJtxkeqZXy085tzh3gPedauMh5qNHPFn6mCCc93CNWbZXPpPhusjhQQ0zwRWpLfwMcdw95OFjxhTkd0dPYyaMNv1kiE5I7Ju4E5V1pgCp3GKZK7anCU54qzEYhO1d~8Pb0VUwp1kzOfEB3U0uJTzVCSTUiAUq4Zq79w8dcoFhgo2-wjWpNnPsxUp0rmPxJpKfZx-wElQkdrK6z8eUxSBbn4VMaqSt3wvUvZZDvDyGEw__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758605,
    //     filename: "f17f0f26-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758606.PNG?Expires=1743275697&Signature=NnAkLOx~VGFmDZqG7Murpc4RpNSW89FtvJj~ov0qI90Uq0MOFHEl5hNsfsmDfOZAZCHBh4LJpqS6pF4qDAdpPdGSqL-jxI9A-WvMwcCflD3Epr5LqHKLX~PU2c-JXlPXBNkJ~RtrIzQ-gKBHHwEeBZ5-kdtXcDvC0sHU1bsLEVp~fEJ7EoZOTuPoNdywOktRk4WnvGL4ww1maHAe0PRzQZcpeDUaSVnqdrXdbXvmyGDvPviXqHaMoAg4sx4azTHuRHi8CMTve7VBJuMASXjgaZg25Fck3I~AaCx2O4KdeG2FJJgOR9hLh1-aUFwQX5HOe80Mput9dR4eOmyG0F1sdw__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758606,
    //     filename: "f192f4b4-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758607.PNG?Expires=1743275697&Signature=PTeHAKqb30hxpHlFJDQThAoisJF4SR~PRqtFeZ6RNetEELPj-t4FodKfZ92xaNXhkA0Y3kk1f-NBxGk94~mwGGjyKxVA6AYUryQAp9JBFkUEBw~Bd7xrPu7e9uWiDvPd~tZwOcxqW-x1fpfRGT8OcID1o-wOCSbbeNBQ6eyC83-iyvu8oFVRUggkeQY6Jy8KNvbx57fRzy-u0yqeye0em~L7KFXtOC5bb9Jf9C147ByrGgLg83zbG4z~Olm4D7JIQMbdHNduJByuK053peQ0UQ9GIFN14vQ0As7NKZRfXpI5iccupYPtSFTJ0DvbDObUBu8vcspwuJxlcPOsP0acMg__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758607,
    //     filename: "f1a830ea-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758608.PNG?Expires=1743275697&Signature=hQE~qg0CJhoHbWIS9Cj6CL0W9~-lmmFL~W5yG~q1Ur0FK6qEQy-nykkssJj4BTJBfVyg2iR~bkHdDz8gOqbwadjwJ~zkCgI589Dk1A29bOKVxyRHCPsSIq8Q8eya7jNaQl9zUaN6Tj-rXePkMf9iPf6YRjDg9ia2txYk7VOfQisH5YWS-~gpzWM5J50bv0GjdscbW5YvHXbw2XIZOU8Or-xHtzSl7CCRxkTtaM-lXuXIHqAmvDq~OFY92JcytdThtESxix-i8qR1tEQIHp~aC50xB6QQnAbEJDfy1eC2bSYxqsv7KIN6Y5aSrIKY0FOYEp5lTan-zrsO8Y~f9-NE1w__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758608,
    //     filename: "f1bdb870-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758609.PNG?Expires=1743275697&Signature=jmgLXjrYCo3LFRrk5EwZgrHse~BDuyx1Hni34WF98XmNAzmDYD9i5KIngsQIG8NskIRlRco6iewQgUWW~26-di0rPiwYVSgj4riEXa4jXRhOgMxtg52UD5eSdOnh11VNgZaz3F2eFgQeWpQI6aBHZWZdxYnr0eoD~mfEtSwZEf~JLZEIcc9gNz3dpNSXZ8KV-FauNVmbU~-h8gmSB18Crw1IbM2IxC9IyOenTjE9WFd2ZBG7x5jcH0Jy1UgFfciSoJYzqh-gpACVd7-h5cFrF7X94eUPOEL9mYg-6k4jw8yuQoEpEHw~40RjqIs64yEdlrhUZeDbbkYZY~Y0KFXGRA__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758609,
    //     filename: "f1d25ab4-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758610.PNG?Expires=1743275698&Signature=lgBhx6Zob3UsoAJyzfydCBMw1LSXNSHL~dtUs0-ZZEjIXAFkKVUldGNV7WGqsQhcgt-dWHjkDP10TPKVGXkDl3yzVOdVG1zvJLefv5bFIRjMboZqnfJn6tDxklRCSRMkPtpZShNleAKIYuaM-Q4pjjw1FWblKu5OXMGatOiyWb~BqTmTW5LqQa0ZUSwSAj2sfoawYk35iC9K3ik98qjfnIzgajS8~VM5-KG3uqyZs2RRDjz45~Hw1KSmmT8YAdcXmVd00OjAeCUguVU9suVxgVrwqTG8dLYgbPqNaVqi7mrjcf0wGLA-IDw3cTSUtvRQHZeZbxJStSHWv3DMOV5-RQ__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758610,
    //     filename: "f1ea9f70-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758611.PNG?Expires=1743275698&Signature=M9l7dsipr~dh9ipoDdc-lAVZZG13EoYzV4E1mFNYQlnA9E6~LMDh7jcDJw0YBkIM1y7rQUfapvVc-vHBvI0IpzTH2M2XMSYiMD7MDZuJvVDk-mLWCBnaw7nBvz7lOgPSyqzcydqiYW3cmtMelKVUKnALxfrMlipI8AgoHu904tudzvW5fSQxCxIfQCtsXJujJQrYdWL7ts6Pjc6HWGJWAoaB6FhuSUdqDjoO9YWoxYph7CinNWnlpf4D~2zMK3NYxmvedfrG1uXTQ58eUSthN5KSG4Lu9ylH-q2FlftH0YokpdtfvoMEE29dqw6kI46QGdgasMSWlOvibzbJQCu-kg__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758611,
    //     filename: "f201a2ce-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758612.PNG?Expires=1743275698&Signature=kzSAjhitHqKqnFpyafwALB7XjlrxrF0q7Mhwf~AD5PW4qSMds6I7JusW4cddKK~ekPnwnAkZs-Yp5cDz6JQehg8ci~s1wo2gvHpby6iBlGqIwBJ~Y3TBHw0dvdWiQ4mH-KyjbJkk3iJF51SFT8zqQwt2mN-~ycZE3Bdx9g8Gm6G6BLNPVEw90-QGZ1oJjKyTri2OKJSmKgn~Zn4q-RQXK7lJxEhAspuum-AqSpJ5gzArnhycHBH3-gCsD4lDnuLLx29a--2FMdLk~PzXAcUdk9NICXeBEcmF5vqsIr1nQBqodQkmd8ZIlUG3dIhWTclLh-h02BDxmx~dmxORIyNI8A__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758612,
    //     filename: "f216db1c-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758613.PNG?Expires=1743275698&Signature=RAAJX5tLIs~ssBfbYylxoyhi4kaNVqTKdP3GgFoCil63ToCku6LvWxixWclABCKj-UmEgQuX6XzXGkjQfa9nBqfMnijIF6~-6959sfSElxS8jMQMjWEetqQLMasnmd7bExRIYmuGIJ~mFRX~19IDzNPcOVFF3VHFWFfZHhA3SO~feALH2YVZnLBcTQ4B3zuvnJa8ym6PCHLEcb2aJaL3cwJNSRmslNugbAesIl-W4wQfRPdDt3gPS5rxrUwXkqez5dx22WThLqHvcxhEdM05Do1TiU05RsTbcgXB9FqWxJhC8lP7fpihhCYmpAOeCZCWcrr7RYzIo3FIp4Cupe0iOw__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758613,
    //     filename: "f22cd4f8-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    //   {
    //     url: "https://d1ei2xrl63k822.cloudfront.net/api/replace_bg_results/efd77e42-0751-11f0-808b-529f39bbbbe0_A_health_food_store_display_efd77e42-0751-11f0-808b-529f39bbbbe0/seed_1379758614.PNG?Expires=1743275698&Signature=IwqwcEBjClajHE-pIwoqYbJwFddxV~tBL4lp96qs~pTnkfjJOFxvj1GbVv0p7oREn33u8sQ1acRPcbQzoZ8YkfsYyTIrXQdidOpEMF1DWwbJsgY-TR6jBdqKVhoMRB~ZEhRYb3qJwhQra4GM5Mly8RL0lq-B97qGHXQWy4amV9-K3c7uDaFwOdz73dAFNFg3C8uClbmzS9pQfKvvtP-A1AiI9rToGVlnqxRIy83xNF9PyvHMjeXgTFjmPg-eQCVDgFuQ3EJ9pbvN8~y-myAjW6FXKnN-D3HvmS19ufrIZ0hmDexL9UQfMVQc5E1TWx-D2KxYT1SpBjOBmSOdqsl-Uw__&Key-Pair-Id=K2UXO1NPZVKO7N",
    //     id: 1379758614,
    //     filename: "f242d226-0751-11f0-808b-529f39bbbbe0.PNG",
    //   },
    // ];

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error generating lifestyle shots:", error);
    return NextResponse.json(
      { error: "Failed to generate lifestyle shots" },
      { status: 500 }
    );
  }
}
